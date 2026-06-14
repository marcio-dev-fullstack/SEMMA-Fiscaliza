# back/main.py
# back/main.py
import os
import uuid
import shutil
from fastapi import FastAPI, Depends, HTTPException, status, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from sqlalchemy import func
from . import models, schemas, auth
from .database import engine, get_db

# Cria a pasta de uploads se não existir
os.makedirs("uploads", exist_ok=True)

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Expõe a pasta uploads para a web (para podermos visualizar as fotos depois)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Configuração de CORS para GitHub Pages
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://sua-organizacao.github.io"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/token", response_model=schemas.Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = auth.get_user_by_username(db, username=form_data.username)
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuário ou senha incorretos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = auth.timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer", "role": user.role}

@app.post("/api/ocorrencia")
async def registrar_ocorrencia(
    tipo_crime: str = Form(...),
    descricao: str = Form(...),
    latitude: float = Form(...),
    longitude: float = Form(...),
    foto: UploadFile = File(None),
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(auth.get_current_user)
):
    foto_url = None
    if foto:
        extensao = foto.filename.split(".")[-1]
        novo_nome = f"{uuid.uuid4()}.{extensao}"
        caminho = f"uploads/{novo_nome}"
        with open(caminho, "wb") as buffer:
            shutil.copyfileobj(foto.file, buffer)
        foto_url = f"/uploads/{novo_nome}"

    point = f"SRID=4326;POINT({longitude} {latitude})"
    nova_denuncia = models.Denuncia(
        descricao=descricao,
        tipo_crime=tipo_crime,
        geom=point,
        fiscal_id=current_user.id,
        foto_url=foto_url
    )
    db.add(nova_denuncia)
    db.commit()
    db.refresh(nova_denuncia)
    return nova_denuncia

@app.get("/api/mapa")
async def buscar_pontos(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    # Extrai as coordenadas diretamente do PostGIS usando ST_X e ST_Y
    pontos = db.query(
        models.Denuncia.id,
        models.Denuncia.tipo_crime,
        models.Denuncia.status,
        func.ST_X(models.Denuncia.geom).label('longitude'),
        func.ST_Y(models.Denuncia.geom).label('latitude')
    ).all()
    return [
        {
            "id": p.id,
            "tipo_crime": p.tipo_crime,
            "status": p.status,
            "latitude": p.latitude,
            "longitude": p.longitude
        }
        for p in pontos
    ]

@app.get("/api/ocorrencias")
async def listar_ocorrencias(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    # Lista as denúncias ordenadas da mais recente para a mais antiga
    denuncias = db.query(models.Denuncia).order_by(models.Denuncia.data_criacao.desc()).all()
    return [
        {
            "id": d.id,
            "tipo_crime": d.tipo_crime,
            "status": d.status,
            "data_criacao": d.data_criacao
        }
        for d in denuncias
    ]

@app.get("/api/ocorrencias/{id}")
async def obter_ocorrencia(id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    ocorrencia = db.query(
        models.Denuncia.id,
        models.Denuncia.descricao,
        models.Denuncia.tipo_crime,
        models.Denuncia.status,
        models.Denuncia.data_criacao,
        models.Denuncia.foto_url,
        func.ST_X(models.Denuncia.geom).label('longitude'),
        func.ST_Y(models.Denuncia.geom).label('latitude')
    ).filter(models.Denuncia.id == id).first()
    
    if not ocorrencia:
        raise HTTPException(status_code=404, detail="Ocorrência não encontrada")
        
    return {
        **ocorrencia._mapping
    }

@app.patch("/api/ocorrencias/{id}/status")
async def atualizar_status(id: int, status_update: schemas.StatusUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    ocorrencia = db.query(models.Denuncia).filter(models.Denuncia.id == id).first()
    if not ocorrencia:
        raise HTTPException(status_code=404, detail="Ocorrência não encontrada")
    
    ocorrencia.status = status_update.status
    db.commit()
    return {"message": "Status atualizado com sucesso", "status": ocorrencia.status}

@app.delete("/api/ocorrencias/{id}")
async def excluir_ocorrencia(id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Apenas administradores podem excluir denúncias")
    
    ocorrencia = db.query(models.Denuncia).filter(models.Denuncia.id == id).first()
    if not ocorrencia:
        raise HTTPException(status_code=404, detail="Ocorrência não encontrada")
    
    db.delete(ocorrencia)
    db.commit()
    return {"message": "Ocorrência excluída com sucesso"}

@app.get("/api/estatisticas")
async def obter_estatisticas(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    total = db.query(models.Denuncia).count()
    
    # Agrupa e conta por status
    por_status = db.query(
        models.Denuncia.status, 
        func.count(models.Denuncia.id).label('quantidade')
    ).group_by(models.Denuncia.status).all()
    
    # Agrupa e conta por tipo de crime
    por_tipo = db.query(
        models.Denuncia.tipo_crime, 
        func.count(models.Denuncia.id).label('quantidade')
    ).group_by(models.Denuncia.tipo_crime).all()
    
    return {
        "total": total,
        "por_status": [{"nome": s[0], "valor": s[1]} for s in por_status],
        "por_tipo": [{"nome": t[0], "valor": t[1]} for t in por_tipo]
    }