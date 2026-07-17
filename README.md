# 🚀 Nexus API

![CI](https://github.com/AndreLopes30/nexus-api/actions/workflows/ci.yml/badge.svg)
![Python Version](https://img.shields.io/badge/python-3.10%2B-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-Modern%20API-green)
![Coverage](https://img.shields.io/badge/coverage-90%25-brightgreen)
![Tests](https://img.shields.io/badge/tests-16%20passed-brightgreen)
![Docker](https://img.shields.io/badge/Docker-ready-2496ED?logo=docker&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

> [Português](#) | [English version below](#-nexus-api--english)

API REST desenvolvida em **Python** com **FastAPI** para gerenciamento de usuários e tarefas, com autenticação JWT, arquitetura modular em camadas, migrations com Alembic, CI/CD com GitHub Actions e 90% de cobertura de testes com Pytest.

**[🟢 API em produção](https://nexus-api-7q6p.onrender.com/docs)**

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
| **Alembic** | Migrations e controle de schema |
| **SQLite / PostgreSQL** | SQLite em desenvolvimento, PostgreSQL em produção |
| **Docker** | Containerização da aplicação |
| **Passlib + Bcrypt** | Hash seguro de senhas |
| **python-jose (JWT)** | Geração e validação de tokens de acesso |
| **Pytest + pytest-cov** | Testes automatizados com cobertura |
| **Ruff** | Linting e formatação de código |
| **GitHub Actions** | Pipeline CI/CD (lint → test) |

---

## 📁 Estrutura do projeto

```
nexus/
├── .github/
│   └── workflows/
│       └── ci.yml              # Pipeline CI: lint (Ruff) + testes (Pytest)
├── alembic/
│   ├── versions/               # Histórico de migrations
│   └── env.py                  # Configuração do Alembic
├── app/
│   ├── api/
│   │   ├── endpoints/
│   │   │   ├── users.py        # Rotas de usuários (90% cobertura)
│   │   │   └── tasks.py        # Rotas de tarefas (92% cobertura)
│   │   └── api.py              # Registro de routers
│   ├── core/
│   │   ├── config.py           # Configurações via variáveis de ambiente
│   │   ├── security.py         # Lógica de JWT e hashing (91% cobertura)
│   │   └── logging_config.py   # Configuração de logs
│   ├── db/
│   │   └── database.py         # Engine e sessão SQLAlchemy
│   ├── models/
│   │   ├── user.py             # Modelo ORM de usuário
│   │   └── task.py             # Modelo ORM de tarefa
│   ├── schemas/
│   │   ├── user.py             # Schemas Pydantic de usuário (95% cobertura)
│   │   ├── task.py             # Schemas Pydantic de tarefa
│   │   └── token.py            # Schema de token JWT
│   └── main.py                 # Entry point FastAPI
├── Tests/
│   └── test_api.py             # 16 testes — 90% de cobertura total
├── docker-compose.yml
├── Dockerfile
├── alembic.ini
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

### Pré-requisitos

- Python 3.10+
- Docker (opcional)

### Via ambiente virtual

```bash
git clone https://github.com/AndreLopes30/nexus-api.git
cd nexus-api

python -m venv venv
source venv/bin/activate   # Linux/macOS
venv\Scripts\activate      # Windows

pip install --upgrade pip
pip install -r requirements.txt
```

Crie o arquivo `.env` na raiz (use `.env.example` como base):

```env
SECRET_KEY=sua_chave_secreta_aqui
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
DATABASE_URL=sqlite:///./nexus.db
```

Aplique as migrations com Alembic:

```bash
alembic upgrade head
```

Inicie a API:

```bash
uvicorn app.main:app --reload
```

Acesse em: `http://127.0.0.1:8000/docs`

### Via Docker

```bash
docker-compose up --build -d

# Logs
docker-compose logs -f

# Parar
docker-compose down
```

---

## 🗄️ Migrations (Alembic)

O projeto usa **Alembic** para controle de schema — padrão em ambientes de produção.

```bash
# Aplicar migrations pendentes
alembic upgrade head

# Ver estado atual
alembic current

# Gerar nova migration após alterar um model
alembic revision --autogenerate -m "descricao_da_mudanca"

# Reverter última migration
alembic downgrade -1
```

> Sempre faça backup antes de rodar migrations em produção:
> ```bash
> pg_dump -Fc --file=backup.dump $DATABASE_URL
> ```

---

## 🔐 Autenticação

1. `POST /users/login` com `username` (email) e `password` em form data.
2. Copie o `access_token` da resposta.
3. Nas rotas protegidas, envie o header:

```
Authorization: Bearer <access_token>
```

No Swagger UI: clique em **Authorize** e cole o token.

O controle de acesso garante isolamento total — usuários só acessam e modificam seus próprios recursos.

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
16 passed in 11.02s — Coverage: 90%
```

| Módulo | Cobertura |
|--------|-----------|
| `api/endpoints/tasks.py` | 92% |
| `api/endpoints/users.py` | 90% |
| `core/security.py` | 91% |
| `schemas/user.py` | 95% |
| `models/` | 100% |
| `schemas/task.py` | 100% |

Os testes usam banco SQLite em memória — isolamento completo, sem dependência de banco externo.

---

## 🔄 CI/CD

O pipeline roda automaticamente em todo push e pull request para `main`/`master`:

1. **Lint** — Ruff verifica estilo e qualidade do código
2. **Testes** — Pytest com banco SQLite em memória

Configuração em `.github/workflows/ci.yml`.

---

## 🧭 Decisões técnicas

**Separação em camadas (models / schemas / routes):** o modelo ORM não vaza para a API; o schema Pydantic valida a entrada antes de qualquer lógica de negócio.

**SQLite em dev, PostgreSQL em produção:** troca feita apenas via `DATABASE_URL` no `.env`, sem alteração de código — SQLAlchemy abstrai o dialeto.

**Alembic para migrations:** `Base.metadata.create_all()` não rastreia histórico de mudanças. Alembic permite evoluir o schema de forma controlada e reversível — essencial em produção.

**JWT com controle de acesso por recurso:** cada rota protegida valida se o usuário autenticado é o dono do recurso antes de qualquer operação.

**Pytest com banco em memória:** testes determinísticos, rápidos e sem efeitos colaterais — o mesmo banco nunca é compartilhado entre execuções.

**Ruff no CI:** linting integrado ao pipeline garante consistência de código sem depender de configuração local.

---

## 📌 Próximas melhorias

- Refresh tokens para renovação de sessão sem novo login
- Paginação e filtros nas rotas de tarefas
- Deploy automático via GitHub Actions

---

## 👨‍💻 Autor

**André Ferreira**
[GitHub](https://github.com/AndreLopes30) · [LinkedIn](https://www.linkedin.com/in/andre-ferreira30)

---

## 📝 Licença

MIT — veja o arquivo `LICENSE`.

---

---

# 🚀 Nexus API — English

![CI](https://github.com/AndreLopes30/nexus-api/actions/workflows/ci.yml/badge.svg)
![Coverage](https://img.shields.io/badge/coverage-90%25-brightgreen)
![Tests](https://img.shields.io/badge/tests-16%20passed-brightgreen)

REST API built with **Python** and **FastAPI** for user and task management, featuring JWT authentication, layered architecture, Alembic migrations, GitHub Actions CI/CD, and 90% test coverage with Pytest.

**[🟢 Live API](https://nexus-api-7q6p.onrender.com/docs)**

---

## 🛠️ Tech Stack

| Technology | Role |
|:-----------|:-----|
| **Python 3.10+** | Main language |
| **FastAPI** | Web framework |
| **SQLAlchemy** | ORM — models and relational mapping |
| **Alembic** | Database migrations and schema versioning |
| **SQLite / PostgreSQL** | SQLite in development, PostgreSQL in production |
| **Docker** | Containerization |
| **Passlib + Bcrypt** | Secure password hashing |
| **python-jose (JWT)** | Token generation and validation |
| **Pytest + pytest-cov** | Automated tests with coverage reporting |
| **Ruff** | Linting and code formatting |
| **GitHub Actions** | CI/CD pipeline (lint → test) |

---

## 🚀 Endpoints

### Users

| Method | Route | Auth | Description |
|:-------|:------|:----:|:------------|
| `POST` | `/users/` | ❌ | Register a new user |
| `POST` | `/users/login` | ❌ | Login — returns `access_token` |
| `GET` | `/users/` | ✅ | List users |
| `GET` | `/users/{user_id}` | ✅ | Get user by ID (own only) |
| `PATCH` | `/users/{user_id}` | ✅ | Update user (own only) |
| `DELETE` | `/users/{user_id}` | ✅ | Delete user (own only) |

### Tasks

| Method | Route | Auth | Description |
|:-------|:------|:----:|:------------|
| `GET` | `/tasks/` | ✅ | List tasks for authenticated user |
| `POST` | `/tasks/` | ✅ | Create task (linked to user) |
| `GET` | `/tasks/{task_id}` | ✅ | Get task (owner only) |
| `PATCH` | `/tasks/{task_id}` | ✅ | Update task (owner only) |
| `DELETE` | `/tasks/{task_id}` | ✅ | Delete task (owner only) |

> Interactive docs available at `/docs` (Swagger UI) and `/redoc`.

---

## ⚙️ Running locally

```bash
git clone https://github.com/AndreLopes30/nexus-api.git
cd nexus-api

python -m venv venv
source venv/bin/activate   # Linux/macOS
venv\Scripts\activate      # Windows

pip install --upgrade pip
pip install -r requirements.txt
```

Create a `.env` file at the project root:

```env
SECRET_KEY=your_secret_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
DATABASE_URL=sqlite:///./nexus.db
```

Run migrations and start the API:

```bash
alembic upgrade head
uvicorn app.main:app --reload
```

Access at: `http://127.0.0.1:8000/docs`

---

## 🧪 Tests

```bash
pytest -q
pytest --cov=app --cov-report=term-missing -q
```

**Current result: 16 passed — 90% coverage**

---

## 🔄 CI/CD

Every push and pull request to `main`/`master` triggers:
1. **Lint** — Ruff checks code quality
2. **Tests** — Pytest runs against an in-memory SQLite database

---

## 👨‍💻 Author

**André Ferreira**
[GitHub](https://github.com/AndreLopes30) · [LinkedIn](https://www.linkedin.com/in/andre-ferreira30)

---

## 📝 License

MIT
