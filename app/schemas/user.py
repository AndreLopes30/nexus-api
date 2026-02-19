from pydantic import BaseModel


class criarUsuario(BaseModel):
    email: str
    senha: str


class lerUsuario(BaseModel):
    id: int
    email: str

    class Config:
        orm_mode = True
   