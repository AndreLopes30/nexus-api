from pydantic import BaseModel, ConfigDict

class criarTarefa(BaseModel):
    title: str
    description: str | None = None

class lerTarefa(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    title: str
    description: str | None = None

class atualizarTarefa(BaseModel):
    title: str | None = None
    description: str | None = None
