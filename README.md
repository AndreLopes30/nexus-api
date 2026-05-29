# 🚀 Nexus API

![Python Version](https://img.shields.io/badge/python-3.10%2B-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-Modern%20API-green)
![Coverage](https://img.shields.io/badge/coverage-89%25-brightgreen)
![Tests](https://img.shields.io/badge/tests-15%20passed-brightgreen)
![Docker](https://img.shields.io/badge/Docker-ready-2496ED?logo=docker&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

API REST desenvolvida em **Python** com **FastAPI** para gerenciamento de usuários e tarefas, com autenticação baseada em JWT, arquitetura modular em camadas e cobertura de testes de 89% com Pytest.

---

## 📸 Preview do sistema

<p align="center">
  <img src="assets/Nexus-API.png" width="100%" alt="Screenshot do Nexus API (Swagger UI)" />
</p>

<p align="center">
  <em>Documentação interativa (Swagger UI) — endpoints de usuários e tarefas.</em>
</p>

---

## 🛠️ Stack tecnológica

| Tecnologia | Uso no projeto |
|:-----------|:---------------|
| **Python 3.10+** | Linguagem principal |
| **FastAPI** | Framework web para a API |
| **SQLAlchemy** | ORM — modelos e mapeamento relacional |
| **SQLite / PostgreSQL** | SQLite em desenvolvimento, PostgreSQL em produção |
| **Docker** | Containerização da aplicação |
| **Passlib + Bcrypt** | Hash seguro de senhas |
| **python-jose (JWT)** | Geração e validação de tokens de acesso |
| **Pytest + pytest-cov** | Testes automatizados com cobertura |

---

## 📁 Estrutura do projeto

```
nexus/
├── app/
│   ├── api/
│   │   ├── endpoints/
│   │   │   ├── users.py        # Rotas de usuários (90% de cobertura)
│   │   │   └── tasks.py        # Rotas de tarefas (92% de cobertura)
│   │   └── api.py              # Registro de routers
│   ├── core/
│   │   ├── config.py           # Configurações via variáveis de ambiente
│   │   ├── security.py         # Lógica de JWT e hashing (91% de cobertura)
│   │   └── logging_config.py   # Configuração de logs
│   ├── db/
│   │   └── database.py         # Engine e sessão SQLAlchemy
│   ├── models/
│   │   ├── user.py             # Modelo ORM de usuário
│   │   └── task.py             # Modelo ORM de tarefa
│   ├── schemas/
│   │   ├── user.py             # Schemas Pydantic de usuário (95% de cobertura)
│   │   ├── task.py             # Schemas Pydantic de tarefa
│   │   └── token.py            # Schema de token JWT
│   └── main.py                 # Entry point FastAPI
├── Tests/
│   └── test_api.py             # 15 testes — 89% de cobertura total
├── docker-compose.yml
├── Dockerfile
├── requirements.txt
└── .env.example
```

---

## 🚀 Endpoints

### Usuários

| Método | Rota | Autenticação | Descrição |
|:-------|:-----|:------------:|:----------|
| `POST` | `/users/` | ❌ | Criar usuário (registro) |
| `POST` | `/users/login` | ❌ | Login — retorna `access_token` |
| `GET` | `/users/` | ✅ | Listar usuários |
| `GET` | `/users/{user_id}` | ✅ | Obter usuário (somente o próprio) |
| `PATCH` | `/users/{user_id}` | ✅ | Atualizar usuário (somente o próprio) |
| `DELETE` | `/users/{user_id}` | ✅ | Deletar usuário (somente o próprio) |

### Tarefas

| Método | Rota | Autenticação | Descrição |
|:-------|:-----|:------------:|:----------|
| `GET` | `/tasks/` | ✅ | Listar tarefas do usuário autenticado |
| `POST` | `/tasks/` | ✅ | Criar tarefa (associada ao usuário) |
| `GET` | `/tasks/{task_id}` | ✅ | Obter tarefa (somente dono) |
| `PATCH` | `/tasks/{task_id}` | ✅ | Atualizar tarefa (somente dono) |
| `DELETE` | `/tasks/{task_id}` | ✅ | Deletar tarefa (somente dono) |

### Health

| Método | Rota | Descrição |
|:-------|:-----|:----------|
| `GET` | `/` | Health check |

> Documentação interativa em `/docs` (Swagger UI) e `/redoc`.

---

## ⚙️ Como rodar o projeto

### Via ambiente virtual

```bash
# Clone o repositório
git clone https://github.com/AndreLopes30/nexus-api.git
cd nexus-api

# Crie e ative o ambiente virtual
python -m venv venv
source venv/bin/activate   # Linux/macOS
venv\Scripts\activate      # Windows

# Instale as dependências
pip install --upgrade pip
pip install -r requirements.txt
```

Crie o arquivo `.env` na raiz:

```env
SECRET_KEY=sua_chave_secreta_aqui
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
DATABASE_URL=sqlite:///./nexus.db
```

Crie as tabelas (primeira execução) — usando Alembic (recomendado):

```bash
# Instale o Alembic no seu ambiente
pip install alembic

# Inicialize a pasta de migrations (apenas na primeira vez)
alembic init alembic

# Gere a revisão inicial com base nos modelos
alembic revision --autogenerate -m "initial"

# Aplique as migrations
alembic upgrade head
```

Antes de aplicar migrations em ambientes compartilhados (staging/produção), sempre faça backup do banco de dados. Exemplo (SQLite):

```bash
cp nexus.db nexus.db.bak
```

Em produção com PostgreSQL, faça um dump:

```bash
# pg_dump -Fc --file=backup.dump $DATABASE_URL
```

Se preferir criar as tabelas manualmente (apenas para desenvolvimento local), você ainda pode usar:

```bash
python -c "from app.db.database import Base, engine; Base.metadata.create_all(bind=engine)"
```

Inicie a API:

```bash
uvicorn app.main:app --reload
```

Acesse em: `http://127.0.0.1:8000/docs`

---

### Via Docker

```bash
docker-compose up --build -d

# Logs
docker-compose logs -f

# Parar
docker-compose down
```

> Configure as variáveis de ambiente no `docker-compose.yml` ou em um arquivo `.env` — nunca deixe `SECRET_KEY` exposto no código.

---

## 🔐 Autenticação

1. Faça `POST /users/login` com `username` (email) e `password` no formato form data.
2. Copie o `access_token` da resposta.
3. Nas rotas protegidas, envie o header:

```
Authorization: Bearer <access_token>
```

No Swagger UI: clique em **Authorize** e cole o token.

O controle de acesso garante isolamento total de dados — usuários só acessam e modificam seus próprios recursos.

---

## 🧪 Testes

```bash
# Executar todos os testes
pytest -q

# Com relatório de cobertura
pytest --cov=app --cov-report=term-missing -q
```

**Resultado atual:**

```
15 passed in 10.53s
Coverage: 89%
```

| Módulo | Cobertura |
|--------|-----------|
| `api/endpoints/tasks.py` | 92% |
| `api/endpoints/users.py` | 90% |
| `core/security.py` | 91% |
| `schemas/user.py` | 95% |
| `models/` | 100% |
| `schemas/task.py` | 100% |

Os testes usam banco SQLite em memória, isolando completamente o ambiente de teste do banco de desenvolvimento.

---

## 🧭 Decisões técnicas

**Separação em camadas (models / schemas / routes / services):** Isola responsabilidades — o modelo ORM não vaza para a API, o schema Pydantic valida a entrada antes de qualquer lógica de negócio.

**SQLite em dev, PostgreSQL em produção:** Troca feita apenas via `DATABASE_URL` no `.env`, sem alteração de código — SQLAlchemy abstrai o dialeto.

**JWT com controle de acesso por recurso:** Cada rota protegida extrai o usuário do token e valida se ele é o dono do recurso antes de qualquer operação — sem exposição cruzada de dados.

**Pytest com banco em memória:** Testes rodam isolados sem dependência de banco externo, garantindo execução rápida e determinística em qualquer ambiente (local ou CI).

---

## 📌 Próximas melhorias

- Refresh tokens para renovação de sessão sem novo login
- Paginação e filtros nas rotas de tarefas
- Pipeline CI/CD com GitHub Actions (lint → test → build)
- Migrations com Alembic para controle de schema em produção

---

## 👨‍💻 Autor

**André Ferreira**
[GitHub](https://github.com/AndreLopes30) · [LinkedIn](https://www.linkedin.com/in/andre-ferreira30)

---

## 📝 Licença

MIT — veja o arquivo `LICENSE`.
