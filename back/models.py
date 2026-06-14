from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from geoalchemy2 import Geometry
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String, default="fiscal")

class Denuncia(Base):
    __tablename__ = "denuncias"

    id = Column(Integer, primary_key=True, index=True)
    descricao = Column(String)
    tipo_crime = Column(String, index=True)
    status = Column(String, default="Pendente")
    geom = Column(Geometry(geometry_type='POINT', srid=4326))
    data_criacao = Column(DateTime(timezone=True), server_default=func.now())
    foto_url = Column(String, nullable=True)
    fiscal_id = Column(Integer, ForeignKey("users.id"))