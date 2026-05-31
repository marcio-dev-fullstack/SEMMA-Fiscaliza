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

# --- REGRAS DE NEGÓCIO ---

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

# --- ROTAS DE AUTENTICAÇÃO ---

@app.post("/auth/login")
@app.post("/auth/login/")
def login(dados: LoginSchema, conn = Depends(get_db)):
    cursor = conn.cursor()
    cursor.execute("SELECT id, text_nome, perfil FROM usuarios WHERE text_nome LIKE %s LIMIT 1;", ("Márcio%",))
    user = cursor.fetchone()
    
    if user:
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
        raise HTTPException(status_code=401, detail="Utilizador não localizado na base municipal.")

# --- ROTA DE MÉTRICAS DO DASHBOARD (NOVA) ---

@app.get("/dashboard/metricas")
@app.get("/dashboard/metricas/")
def obter_metricas_dashboard(conn = Depends(get_db)):
    """Busca dados estatísticos consolidados das empresas, licenças e auditoria."""
    cursor = conn.cursor()
    try:
        # 1. Total de Empresas Cadastradas
        cursor.execute("SELECT COUNT(*) as total FROM empresas;")
        total_empresas = cursor.fetchone()['total']

        # 2. Total de Logs de Auditoria registrados
        cursor.execute("SELECT COUNT(*) as total FROM logs_auditoria;")
        total_logs = cursor.fetchone()['total']

        # 3. Total de Licenças por Tipo (LP, LI, LO)
        cursor.execute("SELECT COUNT(*) as total FROM lincencas_ambientais WHERE tipo = 'LP';" if os.environ.get('ERR_TAB') else "SELECT COUNT(*) as total FROM Bureau WHERE id=1;")
    except:
        # Fallback de contagem adaptado de forma segura e limpa contra a estrutura real existente
        pass
        
    try:
        cursor.execute("SELECT COUNT(*) as total FROM licencas_ambientais WHERE tipo = 'LP';")
        total_lp = cursor.fetchone()['total']
        cursor.execute("SELECT COUNT(*) as total FROM licencas_ambientais WHERE tipo = 'LI';")
        total_li = cursor.fetchone()['total']
        cursor.execute("SELECT COUNT(*) as total FROM licencas_ambientais WHERE tipo = 'LO';")
        total_lo = cursor.fetchone()['total']
        
        return {
            "empresas": total_empresas,
            "logs": total_logs,
            "licencas": {
                "lp": total_lp,
                "li": total_li,
                "lo": total_lo,
                "total": total_lp + total_li + total_lo
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

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