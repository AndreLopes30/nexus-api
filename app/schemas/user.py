from pydantic import BaseModel, validator

class criarUsuario(BaseModel):
    nome: str | None = None
    email: str
    senha: str

    @validator("senha")
    def senha_max_72_bytes(cls, v):
        if len(v.encode("utf-8")) > 72:
            raise ValueError("Senha muito longa, máximo 72 bytes")
        return v

class lerUsuario(BaseModel):
    id: int
    nome: str | None = None
    email: str

    class Config:
        orm_mode = True
   
class atualizarUsuario(BaseModel):
    nome: str | None = None
    email: str | None = None
    senha: str | None = None
