from pydantic import BaseModel

class criarTarefa(BaseModel):
    title: str
    description: str | None = None
    done: bool = False

class lerTarefa(BaseModel):
    id: int
    title: str
    description: str | None = None
    done: bool

    class Config:
        orm_mode = True

class atualizarTarefa(BaseModel):
    title: str | None = None
    description: str | None = None
    done: bool | None = None