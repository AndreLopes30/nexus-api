from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.schemas.task import criarTarefa, lerTarefa, atualizarTarefa
from app.db.database import get_db
from app.models.task import Task
from app.models.user import User
from app.core.security import get_current_user

router = APIRouter()

def get_owner(db: Session, current_user: str) -> User:
    owner = db.query(User).filter(User.email == current_user).first()
    if not owner:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Usuário não encontrado")
    return owner

@router.get("/", response_model=List[lerTarefa])
def list_tasks(current_user: str = Depends(get_current_user), db: Session = Depends(get_db)):
    owner = get_owner(db, current_user)
    tarefas = db.query(Task).filter(Task.owner_id == owner.id).all()
    return [lerTarefa.from_orm(t) for t in tarefas]

@router.post("/", response_model=lerTarefa, status_code=status.HTTP_201_CREATED)
def create_task(tarefa: criarTarefa, current_user: str = Depends(get_current_user), db: Session = Depends(get_db)):
    owner = get_owner(db, current_user)
    tarefa_db = Task(title=tarefa.title, description=tarefa.description, owner_id=owner.id, done=False)
    db.add(tarefa_db)
    db.commit()
    db.refresh(tarefa_db)
    return lerTarefa.from_orm(tarefa_db)

@router.patch("/{task_id}", response_model=lerTarefa)
def update_task(task_id: int, tarefa: atualizarTarefa, current_user: str = Depends(get_current_user), db: Session = Depends(get_db)):
    owner = get_owner(db, current_user)
    tarefa_db = db.query(Task).filter(Task.id == task_id).first()
    if not tarefa_db:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tarefa não encontrada")
    if tarefa_db.owner_id != owner.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Não autorizado")
    
    for field, value in tarefa.dict(exclude_unset=True).items():
        setattr(tarefa_db, field, value)
    
    db.commit()
    db.refresh(tarefa_db)
    return lerTarefa.from_orm(tarefa_db)

@router.delete("/{task_id}")
def delete_task(task_id: int, current_user: str = Depends(get_current_user), db: Session = Depends(get_db)):
    owner = get_owner(db, current_user)
    tarefa_db = db.query(Task).filter(Task.id == task_id).first()
    if not tarefa_db:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tarefa não encontrada")
    if tarefa_db.owner_id != owner.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Não autorizado")
    
    db.delete(tarefa_db)
    db.commit()
    return {"message": "Tarefa deletada com sucesso!"}
