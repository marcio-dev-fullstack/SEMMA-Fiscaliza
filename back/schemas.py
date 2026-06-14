from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    role: str
    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str
    role: str

class DenunciaCreate(BaseModel):
    descricao: str
    tipo_crime: str
    longitude: float
    latitude: float

class DenunciaOut(BaseModel):
    id: int
    status: str
    data_criacao: datetime
    foto_url: Optional[str] = None
    class Config:
        orm_mode = True

class StatusUpdate(BaseModel):
    status: str