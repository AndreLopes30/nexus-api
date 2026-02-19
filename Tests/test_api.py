from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.db import database
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

def setup_module(module):
    Base.metadata.create_all(bind=engine)

app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)

def test_create_user_and_login_and_task():
    payload = {"email": "test@example.com", "senha": "secret"}
    r = client.post("/users/", json=payload)
    assert r.status_code == 201
    data = r.json()
    assert data["email"] == "test@example.com"

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
