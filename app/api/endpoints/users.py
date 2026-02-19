from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from app.schemas.user import criarUsuario, lerUsuario, atualizarUsuario
from app.schemas.token import Token
from app.db.database import get_db
from app.models.user import User
from app.core.security import get_current_user, verify_password, create_access_token, get_password_hash
from sqlalchemy.exc import IntegrityError

router = APIRouter()

def get_user_or_404(db: Session, user_id: int) -> User:
    usuario = db.query(User).filter(User.id == user_id).first()
    if not usuario:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuário não encontrado")
    return usuario

@router.get("/", response_model=List[lerUsuario])
def list_users(current_user: str = Depends(get_current_user), db: Session = Depends(get_db)):
    usuarios = [lerUsuario.from_orm(u) for u in db.query(User).all()]
    return usuarios

@router.post("/", response_model=lerUsuario, status_code=201)
def create_user(usuario: criarUsuario, db: Session = Depends(get_db)):
    hashed_password = get_password_hash(usuario.senha)
    usuario_db = User(nome=usuario.nome, email=usuario.email, hashed_password=hashed_password)
    db.add(usuario_db)
    try:
        db.commit()
        db.refresh(usuario_db)
        return lerUsuario.from_orm(usuario_db)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email já cadastrado")

@router.get("/{user_id}", response_model=lerUsuario)
def get_user(user_id: int, current_user: str = Depends(get_current_user), db: Session = Depends(get_db)):
    usuario = get_user_or_404(db, user_id)
    return lerUsuario.from_orm(usuario)

@router.patch("/{user_id}", response_model=lerUsuario)
def update_user(user_id: int, usuario: atualizarUsuario, current_user: str = Depends(get_current_user), db: Session = Depends(get_db)):
    usuario_db = get_user_or_404(db, user_id)

    if usuario_db.email != current_user:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Não autorizado")

    for field, value in usuario.dict(exclude_unset=True).items():
        if field == "senha":
            setattr(usuario_db, "hashed_password", get_password_hash(value))
        else:
            setattr(usuario_db, field, value)

    db.commit()
    db.refresh(usuario_db)
    return lerUsuario.from_orm(usuario_db)

@router.delete("/{user_id}")
def delete_user(user_id: int, current_user: str = Depends(get_current_user), db: Session = Depends(get_db)):
    usuario_db = get_user_or_404(db, user_id)
    if usuario_db.email != current_user:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Não autorizado")
    db.delete(usuario_db)
    db.commit()
    return {"message": "Usuário deletado com sucesso!"}

@router.post("/login", response_model=Token)
def login_user(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    usuario = db.query(User).filter(User.email == form_data.username).first()
    if not usuario or not verify_password(form_data.password, usuario.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Credenciais inválidas")
    access_token = create_access_token({"sub": usuario.email})
    return {"access_token": access_token, "token_type": "bearer"}
