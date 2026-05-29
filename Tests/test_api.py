from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.db.database import Base, get_db

# Banco SQLite local temporário para isolar os testes
TEST_SQLALCHEMY_DATABASE_URL = "sqlite:///./test_nexus.db"
engine = create_engine(TEST_SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)

def setup_function(function):
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

def teardown_function(function):
    Base.metadata.drop_all(bind=engine)

# ==================== TESTES EXISTENTES (CORRIGIDOS) ====================

def test_create_user_login_and_task():
    payload = {"nome": "Test", "email": "test@example.com", "senha": "secret"}
    r = client.post("/users/", json=payload)
    assert r.status_code == 201
    data = r.json()
    assert data["email"] == "test@example.com"

    login_data = {"username": "test@example.com", "password": "secret"}
    r = client.post("/users/login", data=login_data)
    assert r.status_code == 200
    token = r.json()["access_token"]

    headers = {"Authorization": f"Bearer {token}"}
    task_payload = {"title": "tarefa 1", "description": "desc", "done": False}
    r = client.post("/tasks/", json=task_payload, headers=headers)
    assert r.status_code == 201

def test_create_user_email_unique():
    payload = {"nome": "User1", "email": "unique@example.com", "senha": "secret"}
    r = client.post("/users/", json=payload)
    assert r.status_code == 201

    payload = {"nome": "User2", "email": "unique@example.com", "senha": "secret2"}
    r = client.post("/users/", json=payload)
    assert r.status_code == 400

def test_login_wrong_password():
    client.post("/users/", json={"nome": "U", "email": "u@test.com", "senha": "pass"})
    r = client.post("/users/login", data={"username": "u@test.com", "password": "wrong"})
    assert r.status_code == 401

def test_task_forbidden_other_user():
    client.post("/users/", json={"nome": "U1", "email": "u1@test.com", "senha": "pass"})
    client.post("/users/", json={"nome": "U2", "email": "u2@test.com", "senha": "pass"})
    
    t1 = client.post("/users/login", data={"username": "u1@test.com", "password": "pass"})
    t2 = client.post("/users/login", data={"username": "u2@test.com", "password": "pass"})
    
    h1 = {"Authorization": f"Bearer {t1.json()['access_token']}"}
    h2 = {"Authorization": f"Bearer {t2.json()['access_token']}"}
    
    task = client.post("/tasks/", json={"title": "t1"}, headers=h1).json()
    
    r = client.delete(f"/tasks/{task['id']}", headers=h2)
    assert r.status_code == 403

def test_list_tasks_unauthenticated():
    r = client.get("/tasks/")
    assert r.status_code == 401    

def test_health_check():
    r = client.get("/")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"

def test_update_task_success():
    client.post("/users/", json={"nome": "TaskOwner", "email": "owner@test.com", "senha": "pass"})
    t = client.post("/users/login", data={"username": "owner@test.com", "password": "pass"})
    headers = {"Authorization": f"Bearer {t.json()['access_token']}"}
    
    task = client.post("/tasks/", json={"title": "Tarefa Antiga", "description": "Desc"}, headers=headers).json()
    
    r = client.patch(f"/tasks/{task['id']}", json={"title": "Tarefa Atualizada"}, headers=headers)
    assert r.status_code == 200
    assert r.json()["title"] == "Tarefa Atualizada"

def test_update_task_not_found():
    client.post("/users/", json={"nome": "User", "email": "user@test.com", "senha": "pass"})
    t = client.post("/users/login", data={"username": "user@test.com", "password": "pass"})
    headers = {"Authorization": f"Bearer {t.json()['access_token']}"}
    
    r = client.patch("/tasks/9999", json={"title": "Inexistente"}, headers=headers)
    assert r.status_code == 404

def test_update_task_forbidden():
    client.post("/users/", json={"nome": "U1", "email": "u1@test.com", "senha": "pass"})
    client.post("/users/", json={"nome": "U2", "email": "u2@test.com", "senha": "pass"})
    
    t1 = client.post("/users/login", data={"username": "u1@test.com", "password": "pass"})
    t2 = client.post("/users/login", data={"username": "u2@test.com", "password": "pass"})
    
    h1 = {"Authorization": f"Bearer {t1.json()['access_token']}"}
    h2 = {"Authorization": f"Bearer {t2.json()['access_token']}"}
    
    task = client.post("/tasks/", json={"title": "Dono U1"}, headers=h1).json()
    
    r = client.patch(f"/tasks/{task['id']}", json={"title": "Tentativa Hack"}, headers=h2)
    assert r.status_code == 403

def test_update_user_own_profile():
    res = client.post("/users/", json={"nome": "Original", "email": "profile@test.com", "senha": "pass"})
    user_id = res.json()["id"]
    
    t = client.post("/users/login", data={"username": "profile@test.com", "password": "pass"})
    headers = {"Authorization": f"Bearer {t.json()['access_token']}"}
    
    r = client.patch(f"/users/{user_id}", json={"nome": "Novo Nome", "senha": "newpassword"}, headers=headers)
    assert r.status_code == 200
    assert r.json()["nome"] == "Novo Nome"

def test_update_user_forbidden():
    res_u1 = client.post("/users/", json={"nome": "U1", "email": "u1@test.com", "senha": "pass"})
    client.post("/users/", json={"nome": "U2", "email": "u2@test.com", "senha": "pass"})
    
    t2 = client.post("/users/login", data={"username": "u2@test.com", "password": "pass"})
    headers = {"Authorization": f"Bearer {t2.json()['access_token']}"}
    
    r = client.patch(f"/users/{res_u1.json()['id']}", json={"nome": "Hack"}, headers=headers)
    assert r.status_code == 403

def test_delete_user_own_profile():
    res = client.post("/users/", json={"nome": "Deletar", "email": "delete@test.com", "senha": "pass"})
    user_id = res.json()["id"]
    
    t = client.post("/users/login", data={"username": "delete@test.com", "password": "pass"})
    headers = {"Authorization": f"Bearer {t.json()['access_token']}"}
    
    r = client.delete(f"/users/{user_id}", headers=headers)
    assert r.status_code == 200
    assert r.json()["message"] == "Usuário deletado com sucesso!"