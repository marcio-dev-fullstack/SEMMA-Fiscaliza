from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, StreamingResponse
from pydantic import BaseModel
from datetime import datetime, timedelta
import psycopg2
from psycopg2.extras import RealDictCursor
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
import io
import os

app = FastAPI(title="Fiscaliza Ambiental", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

def get_db():
    conn = psycopg2.connect(
        dbname="fiscaliza_db",
        user="postgres",
        password="mamst1ns",
        host="127.0.0.1",
        port="5432",
        cursor_factory=RealDictCursor
    )
    conn.set_client_encoding('UTF8')
    try:
        yield conn
    finally:
        conn.close()

class LicencaSchema(BaseModel):
    empresa_id: int
    tipo: str
    numero_processo: str
    dias_validade: int
    conteudo_tecnico: str
    usuario_id: int

def verificar_licenca_software(conn = Depends(get_db)):
    cursor = conn.cursor()
    cursor.execute("SELECT data_instalacao, chave_ativacao, bloqueado FROM controle_sistema ORDER BY id DESC LIMIT 1;")
    registro = cursor.fetchone()
    if registro:
        if registro['bloqueado']:
            raise HTTPException(status_code=403, detail="Sistema bloqueado. Licença expirada.")
        prazo_limite = registro['data_instalacao'] + timedelta(days=180)
        if datetime.now() > prazo_limite and not registro['chave_ativacao']:
            cursor.execute("UPDATE controle_sistema SET bloqueado = TRUE WHERE id = 1;")
            conn.commit()
            raise HTTPException(status_code=403, detail="O período comercial de trial de 180 dias expirou.")

# --- ROTAS DA API ---

@app.post("/licencas/emitir")
@app.post("/licencas/emitir/")
def emitir_licenca(licenca: LicencaSchema, conn = Depends(get_db), dependencies=[Depends(verificar_licenca_software)]):
    cursor = conn.cursor()
    cursor.execute("SELECT perfil FROM usuarios WHERE id = %s;", (licenca.usuario_id,))
    user = cursor.fetchone()
    if not user or user['perfil'] not in ['Administrador', 'Analista']:
        raise HTTPException(status_code=401, detail="Perfil logado não possui autorização de emissão.")

    data_emissao = datetime.now().date()
    data_vencimento = data_emissao + timedelta(days=licenca.dias_validade)
    codigo_qr = f"FSCLZ-{licenca.numero_processo}-{int(datetime.now().timestamp())}"

    try:
        cursor.execute(
            """INSERT INTO licencas_ambientais 
            (empresa_id, tipo, numero_processo, data_emissao, data_vencimento, emitido_por, conteudo_tecnico, bloqueado_para_edicao, codigo_autenticidade_qr)
            VALUES (%s, %s, %s, %s, %s, %s, %s, TRUE, %s) RETURNING id;""",
            (licenca.empresa_id, licenca.tipo, licenca.numero_processo, data_emissao, data_vencimento, licenca.usuario_id, licenca.conteudo_tecnico, codigo_qr)
        )
        licenca_id = cursor.fetchone()['id']
        cursor.execute(
            "INSERT INTO logs_auditoria (usuario_id, acao, tabela_afetada, registro_id) VALUES (%s, %s, %s, %s);",
            (licenca.usuario_id, f"EMISSAO_LICENCA_{licenca.tipo}", "licencas_ambientais", licenca_id)
        )
        conn.commit()
        return {"status": "Sucesso", "licenca_id": licenca_id, "codigo_verificacao": codigo_qr}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/licencas/{licenca_id}/pdf")
def gerar_pdf_licenca(licenca_id: int, conn = Depends(get_db)):
    cursor = conn.cursor()
    cursor.execute(
        """SELECT l.*, e.razao_social, e.cnpj, u.text_nome as emissor 
           FROM licencas_ambientais l 
           JOIN empresas e ON l.empresa_id = e.id 
           JOIN usuarios u ON l.emitido_por = u.id 
           WHERE l.id = %s;""", (licenca_id,)
    )
    dados = cursor.fetchone()
    if not dados:
        raise HTTPException(status_code=404, detail="Licença não localizada.")

    buffer = io.BytesIO()
    p = canvas.Canvas(buffer, pagesize=letter)
    p.setFont("Helvetica-Bold", 14)
    p.drawCentredString(300, 750, "SECRETARIA MUNICIPAL DE MEIO AMBIENTE")
    p.setFont("Helvetica", 11)
    p.drawCentredString(300, 735, f"CHAVE DE CONTROLE REGULATÓRIO — LICENÇA AMBIENTAL {dados['tipo']}")
    p.line(50, 720, 550, 720)
    
    p.setFont("Helvetica-Bold", 10)
    p.drawString(50, 690, f"Processo Administrativo: {dados['numero_processo']}")
    p.drawString(50, 670, f"Razão Social: {dados['razao_social']}")
    p.drawString(50, 650, f"CNPJ: {dados['cnpj']}")
    p.drawString(50, 620, f"Vigência: {dados['data_emissao']} até {dados['data_vencimento']}")
    
    p.drawString(50, 590, "Parecer Técnico e Restrições:")
    p.setFont("Helvetica", 10)
    txt = p.beginText(50, 570)
    txt.textLines(dados['conteudo_tecnico'])
    p.drawText(txt)
    
    p.saveState()
    p.setFont("Helvetica-Bold", 42)
    p.setFillColorRGB(0.94, 0.94, 0.94)
    p.translate(300, 400)
    p.rotate(45)
    p.drawCentredString(0, 0, "FISCALIZA AMBIENTAL")
    p.restoreState()
    
    p.line(50, 130, 550, 130)
    p.setFont("Helvetica-Oblique", 8)
    p.drawString(50, 115, f"Responsável Técnico de Emissão: {dados['emissor']}")
    p.setFont("Helvetica-Bold", 8)
    p.drawString(50, 100, f"Código de Autenticidade QR-ID: {dados['codigo_autenticidade_qr']}")
    
    p.showPage()
    p.save()
    buffer.seek(0)
    return StreamingResponse(buffer, media_type="application/pdf")

# --- ACOPLAMENTO DO FRONTEND COM CAMINHOS ABSOLUTOS FIXOS ---

FRONTEND_DIST = "C:\\PROJETOS\\SEMMA-Fiscaliza\\frontend\\dist"
ASSETS_DIR = "C:\\PROJETOS\\SEMMA-Fiscaliza\\frontend\\dist\\assets"

# Força o montagem dos arquivos com cabeçalhos de controle de cache desativados para homologação local
app.mount("/assets", StaticFiles(directory=ASSETS_DIR), name="assets")

@app.get("/")
def servir_index():
    return FileResponse(os.path.join(FRONTEND_DIST, "index.html"), headers={"Cache-Control": "no-store"})

@app.get("/{full_path:path}")
def responder_rotas_react(full_path: str):
    if full_path.startswith("assets") or full_path.startswith("licencas") or full_path in ["docs", "openapi.json"]:
        raise HTTPException(status_code=404)
    return FileResponse(os.path.join(FRONTEND_DIST, "index.html"), headers={"Cache-Control": "no-store"})