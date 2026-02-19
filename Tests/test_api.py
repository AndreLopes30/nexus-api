from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.db.database import Base, get_db

TEST_SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
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
    Base.metadata.create_all(bind=engine)

def teardown_function(function):
    Base.metadata.drop_all(bind=engine)

def test_create_user_login_and_task():
    payload = {"nome": "Test", "email": "test@example.com", "senha": "secret"}
    r = client.post("/users/", json=payload)
    assert r.status_code == 201
    data = r.json()
    assert data["email"] == "test@example.com"
    assert data["nome"] == "Test"

    login_data = {"username": "test@example.com", "password": "secret"}
    r = client.post("/users/login", data=login_data)
    assert r.status_code == 200
    token = r.json()["access_token"]
    assert token

    headers = {"Authorization": f"Bearer {token}"}
    task_payload = {"title": "tarefa 1", "description": "desc", "done": False}
    r = client.post("/tasks/", json=task_payload, headers=headers)
    assert r.status_code == 201
    task = r.json()
    assert task["title"] == "tarefa 1"
    assert task["description"] == "desc"
    assert task["done"] is False

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
    client.post("/users/", json={"email": "u1@test.com", "senha": "pass"})
    client.post("/users/", json={"email": "u2@test.com", "senha": "pass"})
    
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