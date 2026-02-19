from pydantic import BaseModel

class criarTarefa(BaseModel):
    title: str
    description: str | None = None
    done: bool = False
    owner_id: int | None = None

class lerTarefa(BaseModel):
    id: int
    title: str
    description: str | None = None
    done: bool
    owner_id: int | None = None

    class Config:
        orm_mode = True

class atualizarTarefa(BaseModel):
    title: str | None = None
    description: str | None = None
    done: bool | None = None