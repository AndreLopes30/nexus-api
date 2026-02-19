from pydantic import BaseModel, field_validator, ConfigDict

class criarUsuario(BaseModel):
    nome: str | None = None
    email: str
    senha: str

    @field_validator("senha")
    @classmethod
    def senha_max_72_bytes(cls, v: str) -> str:
        if len(v.encode("utf-8")) > 72:
            raise ValueError("Senha muito longa, máximo 72 bytes")
        return v

class lerUsuario(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    nome: str | None = None
    email: str
   
class atualizarUsuario(BaseModel):
    nome: str | None = None
    email: str | None = None
    senha: str | None = None