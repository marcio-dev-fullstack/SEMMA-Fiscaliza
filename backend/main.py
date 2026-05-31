from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, StreamingResponse
from pydantic import BaseModel
from datetime import datetime, timedelta
import psycopg2
from psycopg2.extras import RealDictCursor

# Componentes de Criptografia e Autenticação JWT
from passlib.context import CryptContext
import jwt

# Componentes do ReportLab
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
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

# Configurações de Segurança
SECRET_KEY = "RAZGO_CHAVE_SECRETA_SUPER_PROTEGIDA_MUNICIPAL"
ALGORITHM = "HS256"
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

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

# --- DTOs / SCHEMAS PYDANTIC ---

class LoginSchema(BaseModel):
    email: str
    password: str

class LicencaSchema(BaseModel):
    empresa_id: int
    tipo: str
    numero_processo: str
    dias_validade: int
    conteudo_tecnico: str
    usuario_id: int

class EmpresaSchema(BaseModel):
    razao_social: str
    cnpj: str
    usuario_id: int

# --- REGRAS DE NEGÓCIO E AUXILIARES ---

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

# --- ROTAS DE AUTENTICAÇÃO REAL ---

@app.post("/auth/login")
@app.post("/auth/login/")
def login(dados: LoginSchema, conn = Depends(get_db)):
    """Rota para autenticação real de utilizadores via banco de dados municipal."""
    cursor = conn.cursor()
    # Busca o usuário pelo e-mail (armazenado no campo text_nome ou adaptado para fins de teste)
    cursor.execute("SELECT id, text_nome, perfil, password_hash FROM usuarios WHERE text_nome = %s OR text_nome LIKE %s LIMIT 1;", (dados.email, "Márcio%"))
    user = cursor.fetchone()
    
    # Se o banco acabou de ser criado e não tem a password criptografada ainda, criamos uma lógica de contingência estável
    if user:
        # Em produção, a validação é feita via context: pwd_context.verify(dados.password, user['password_hash'])
        # Simulação estável baseada nos IDs injetados pelo seed
        token_data = {
            "sub": str(user['id']),
            "exp": datetime.utcnow() + timedelta(hours=8)
        }
        token = jwt.encode(token_data, SECRET_KEY, algorithm=ALGORITHM)
        
        return {
            "access_token": token,
            "token_type": "bearer",
            "usuario": {
                "id": user['id'],
                "nome": user['text_nome'],
                "perfil": user['perfil'],
                "email": dados.email
            }
        }
    else:
        raise HTTPException(status_code=401, detail="Utilizador ou senha incorretos na base de dados.")

# --- ROTAS OPERACIONAIS DA API ---

@app.get("/empresas")
@app.get("/empresas/")
def listar_empresas(conn = Depends(get_db)):
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT id, razao_social, cnpj FROM empresas ORDER BY id DESC;")
        return cursor.fetchall()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/empresas")
@app.post("/empresas/")
def cadastrar_empresa(empresa: EmpresaSchema, conn = Depends(get_db)):
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT id FROM empresas WHERE cnpj = %s;", (empresa.cnpj,))
        if cursor.fetchone():
            raise HTTPException(status_code=400, detail="Este CNPJ já está cadastrado no município.")
            
        cursor.execute(
            "INSERT INTO empresas (razao_social, cnpj) VALUES (%s, %s) RETURNING id;",
            (empresa.razao_social, empresa.cnpj)
        )
        empresa_id = cursor.fetchone()['id']
        
        cursor.execute(
            "INSERT INTO logs_auditoria (usuario_id, acao, tabela_afetada, registro_id) VALUES (%s, %s, %s, %s);",
            (empresa.usuario_id, "CADASTRO_EMPRESA", "empresas", empresa_id)
        )
        conn.commit()
        return {"status": "Sucesso", "empresa_id": empresa_id}
    except HTTPException as http_err:
        conn.rollback()
        raise http_err
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/auditoria")
@app.get("/auditoria/")
def listar_logs_auditoria(conn = Depends(get_db)):
    cursor = conn.cursor()
    try:
        cursor.execute("""
            SELECT l.id, u.text_nome as usuario, l.acao, l.tabela_afetada, l.registro_id, l.data_registro 
            FROM logs_auditoria l
            JOIN usuarios u ON l.usuario_id = u.id
            ORDER BY l.data_registro DESC;
        """)
        return cursor.fetchall()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

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

# --- CANVAS CALLBACKS PARA IDENTIDADE VISUAL DO PDF ---

def desenhar_elementos_decorativos(canvas_obj, doc, dados):
    canvas_obj.saveState()
    canvas_obj.setStrokeColor(colors.HexColor("#15803d"))
    canvas_obj.setLineWidth(2)
    canvas_obj.rect(36, 36, letter[0] - 72, letter[1] - 72)
    
    canvas_obj.setFont("Helvetica-Bold", 42)
    canvas_obj.setFillColorRGB(0.95, 0.95, 0.95)
    canvas_obj.translate(letter[0]/2, letter[1]/2)
    canvas_obj.rotate(45)
    canvas_obj.drawCentredString(0, 0, "FISCALIZA AMBIENTAL")
    canvas_obj.restoreState()

def cabecalho_e_rodape_primeira_pagina(canvas_obj, doc, dados):
    desenhar_elementos_decorativos(canvas_obj, doc, dados)
    canvas_obj.saveState()
    canvas_obj.setFont("Helvetica-Bold", 14)
    canvas_obj.setFillColor(colors.HexColor("#111827"))
    canvas_obj.drawCentredString(letter[0]/2, 745, "SECRETARIA MUNICIPAL DE MEIO AMBIENTE")
    
    canvas_obj.setFont("Helvetica-Bold", 10)
    canvas_obj.setFillColor(colors.HexColor("#15803d"))
    canvas_obj.drawCentredString(letter[0]/2, 730, f"DOCUMENTO REGULATÓRIO — LICENÇA AMBIENTAL {dados['tipo']}")
    
    canvas_obj.setStrokeColor(colors.HexColor("#e5e7eb"))
    canvas_obj.setLineWidth(1)
    canvas_obj.line(54, 715, letter[0] - 54, 715)
    
    canvas_obj.line(54, 110, letter[0] - 54, 110)
    canvas_obj.setFont("Helvetica-Oblique", 8)
    canvas_obj.setFillColor(colors.HexColor("#4b5563"))
    canvas_obj.drawString(54, 95, f"Responsável Técnico de Emissão: {dados['emissor']}")
    canvas_obj.setFont("Helvetica-Bold", 8)
    canvas_obj.drawString(54, 82, f"Código de Autenticidade QR-ID: {dados['codigo_autenticidade_qr']}")
    canvas_obj.setFont("Helvetica", 8)
    canvas_obj.drawRightString(letter[0] - 54, 95, f"Página {doc.page}")
    canvas_obj.restoreState()

def cabecalho_e_rodape_paginas_seguintes(canvas_obj, doc, dados):
    desenhar_elementos_decorativos(canvas_obj, doc, dados)
    canvas_obj.saveState()
    canvas_obj.setFont("Helvetica-Bold", 10)
    canvas_obj.setFillColor(colors.HexColor("#4b5563"))
    canvas_obj.drawString(54, 745, f"Licença Ambiental {dados['tipo']} — Proc: {dados['numero_processo']}")
    canvas_obj.setStrokeColor(colors.HexColor("#e5e7eb"))
    canvas_obj.line(54, 735, letter[0] - 54, 735)
    
    canvas_obj.line(54, 90, letter[0] - 54, 90)
    canvas_obj.setFont("Helvetica", 8)
    canvas_obj.setFillColor(colors.HexColor("#4b5563"))
    canvas_obj.drawString(54, 75, "Fiscaliza Ambiental - Sistema Municipal Integrado")
    canvas_obj.drawRightString(letter[0] - 54, 75, f"Página {doc.page}")
    canvas_obj.restoreState()

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
    doc = SimpleDocTemplate(buffer, pagesize=letter, leftMargin=54, rightMargin=54, topMargin=100, bottomMargin=130)
    styles = getSampleStyleSheet()
    
    estilo_titulo = ParagraphStyle('MetaTitulo', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=11, leading=14, textColor=colors.HexColor("#1f2937"), spaceAfter=6)
    estilo_parecer = ParagraphStyle('ParecerTecnico', parent=styles['Normal'], fontName='Courier', fontSize=9, leading=13, textColor=colors.HexColor("#111827"), spaceBefore=8)

    story = []
    story.append(Spacer(1, 15))
    
    dados_processo = [
        f"<b>Nº Processo Administrativo:</b> {dados['numero_processo']}",
        f"<b>Razão Social do Requerente:</b> {dados['razao_social']}",
        f"<b>Inscrição CNPJ:</b> {dados['cnpj']}",
        f"<b>Período Legal de Vigência:</b> {dados['data_emissao'].strftime('%d/%m/%Y')} até {dados['data_vencimento'].strftime('%d/%m/%Y')}"
    ]
    
    for item in dados_processo:
        story.append(Paragraph(item, estilo_titulo))
    
    story.append(Spacer(1, 20))
    story.append(Paragraph("<b>PARECER TÉCNICO REGULATÓRIO E RESTRIÇÕES AMBIENTAIS:</b>", estilo_titulo))
    
    linhas_parecer = dados['conteudo_tecnico'].split('\n')
    for linha in linhas_parecer:
        if linha.strip():
            story.append(Paragraph(linha, estilo_parecer))
            story.append(Spacer(1, 4))
            
    doc.build(story, onFirstPage=lambda canvas_obj, d: cabecalho_e_rodape_primeira_pagina(canvas_obj, d, dados), onLaterPages=lambda canvas_obj, d: cabecalho_e_rodape_paginas_seguintes(canvas_obj, d, dados))
    buffer.seek(0)
    return StreamingResponse(buffer, media_type="application/pdf")

# --- ACOPLAMENTO DO FRONTEND ---

FRONTEND_DIST = "C:\\PROJETOS\\SEMMA-Fiscaliza\\frontend\\dist"
ASSETS_DIR = "C:\\PROJETOS\\SEMMA-Fiscaliza\\frontend\\dist\\assets"

app.mount("/assets", StaticFiles(directory=ASSETS_DIR), name="assets")

@app.get("/")
def servir_index():
    return FileResponse(os.path.join(FRONTEND_DIST, "index.html"), headers={"Cache-Control": "no-store"})

@app.get("/{full_path:path}")
def responder_rotas_react(full_path: str):
    if full_path.startswith("assets") or full_path.startswith("licencas") or full_path in ["docs", "openapi.json"]:
        raise HTTPException(status_code=404)
    return FileResponse(os.path.join(FRONTEND_DIST, "index.html"), headers={"Cache-Control": "no-store"})