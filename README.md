# 🚀 Nexus API

![Python Version](https://img.shields.io/badge/python-3.10%2B-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-Modern%20API-green)
![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

API REST desenvolvida em **Python** utilizando **FastAPI** para gerenciamento de usuários e tarefas, com autenticação baseada em JWT. O objetivo deste projeto é demonstrar aplicação de **boas práticas** em APIs REST, autenticação com **JWT**, organização modular e testes automatizados.

---

## 📸 Preview do Sistema

<p align="center">
  <img src="assets/Nexus-API.png" width="100%" alt="Screenshot do Nexus API (Swagger)" />
</p>

<p align="center">
  <em>Documentação interativa (Swagger UI) — endpoints de usuários e tarefas.</em>
</p>


---

## 🛠️ Stack Tecnológica

| Tecnologia              |                                                        Ícone                                                        | Uso no projeto                                      |
| :---------------------- | :-----------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------- |
| **Python**              |  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/python/python-original.svg" width="25">  | Linguagem principal                                 |
| **FastAPI**             | <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/fastapi/fastapi-original.svg" width="25"> | Framework web para a API                            |
| **SQLAlchemy**          |  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/python/python-original.svg" width="25">  | ORM (modelos e migrations simples)                  |
| **SQLite / PostgreSQL** |  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/sqlite/sqlite-original.svg" width="25">  | Persistência (SQLite em dev / Postgres em produção) |
| **Docker**              |  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/docker/docker-original.svg" width="25">  | Containerização (opcional)                          |
| **Passlib + Bcrypt**    |                                                          🔐                                                         | Hash de senha                                       |
| **python-jose (JWT)**   |                                                          🔑                                                         | Geração/validação de tokens                         |
| **Pytest**              |                                                          🧪                                                         | Testes automatizados                                |

---

## 🚀 Funcionalidades (Endpoints)

| Método   | Rota               | Descrição                                             |
| :------- | :----------------- | :---------------------------------------------------- |
| `GET`    | `/`                | Health check (status da API)                          |
| `POST`   | `/users/`          | Criar usuário (registro)                              |
| `POST`   | `/users/login`     | Login → retorna `access_token` (form data OAuth2)     |
| `GET`    | `/users/`          | Listar usuários (autenticado)                         |
| `GET`    | `/users/{user_id}` | Obter usuário por id (autenticado, somente o próprio) |
| `PATCH`  | `/users/{user_id}` | Atualizar usuário (autenticado, somente o próprio)    |
| `DELETE` | `/users/{user_id}` | Deletar usuário (autenticado, somente o próprio)      |
| `GET`    | `/tasks/`          | Listar tarefas do usuário autenticado                 |
| `POST`   | `/tasks/`          | Criar tarefa (associa ao usuário autenticado)         |
| `GET`    | `/tasks/{task_id}` | Obter tarefa específica (só dono)                     |
| `PATCH`  | `/tasks/{task_id}` | Atualizar tarefa (só dono)                            |
| `DELETE` | `/tasks/{task_id}` | Deletar tarefa (só dono)                              |

> Documentação completa e teste interativo: `http://127.0.0.1:8000/docs` (Swagger UI) ou `http://127.0.0.1:8000/redoc` (Redoc).

---

## 📦 Como rodar o projeto

### Pré-requisitos

* Python 3.10+
* (Opcional) Docker & docker-compose
* Recomendo usar um virtualenv (venv)

### 🐍 Via ambiente virtual

```bash
# Clone o repositório
git clone https://github.com/AndreLopes30/nexus-api.git
cd nexus-api

# Crie o ambiente virtual
python -m venv venv
```

#### ▶ Ative o ambiente virtual

**Windows:**
```bash
venv\Scripts\activate
```

**macOS / Linux:**
```bash
source venv/bin/activate
```

---

### 📦 Instale as dependências

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

---

### ⚙️ Configure o arquivo `.env`

Crie manualmente um arquivo chamado `.env` na raiz do projeto com o seguinte conteúdo:

```env
SECRET_KEY=uma_chave_muito_secreta_mude_ja
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
DATABASE_URL=sqlite:///./nexus.db
```

> ⚠️ Nunca commit o arquivo `.env` no repositório.

---

### 🗄️ Criar as tabelas (primeira execução)

```bash
python -c "from app.db.database import Base, engine; Base.metadata.create_all(bind=engine)"
```

---

### 🚀 Rode a API

```bash
uvicorn app.main:app --reload
```

Acesse no navegador:

```
http://127.0.0.1:8000/docs
```

---

### 🐋 Via Docker

```bash
# Build e sobe (exemplo genérico)
docker-compose up --build -d

# Logs
docker-compose logs -f

# Parar e remover
docker-compose down
```

> No `docker-compose.yml` use variáveis de ambiente (não coloque SECRET_KEY inline). Exemplo: `SECRET_KEY=${SECRET_KEY}` e defina a variável no seu ambiente ou no serviço de CI/CD.

---

## 🔐 Uso de autenticação (rápido)

* Faça `POST /users/login` com `username` (email) e `password` (form data).
* Copie `access_token` do retorno.
* Em requisições protegidas, adicione header:

```
Authorization: Bearer <access_token>
```

No Swagger UI: clique em **Authorize** e cole `Bearer <token>`.

---

## 🧪 Testes

```bash
# Com venv ativado
pytest -q
```

* O projeto inclui testes que usam SQLite em memória.
* Os testes cobrem: criar usuário, login, criar tarefa e fluxo autenticado básico.

---

## 🧭 Boas práticas e observações

* Nunca commit seu `.env` ou secrets. Use `.gitignore` para `.env`.
* Em produção, use PostgreSQL (defina `DATABASE_URL` apropriado).
* Troque a `SECRET_KEY` se ela foi exposta em algum commit público.
* Use `git-filter-repo` ou BFG caso precise remover secrets do histórico.

---

## 📌 Próximas melhorias 

* Adicionar refresh tokens (segurança/UX)
* Paginação e filtros nas rotas de tarefas
* Melhoria das mensagens de erro e schemas de resposta
* Documentação com exemplos de requests no README

---

## 👨‍💻 Autor

Desenvolvido por **André Lopes**
GitHub: [https://github.com/AndreLopes30](https://github.com/AndreLopes30)

---

## 📝 Licença

MIT — veja o arquivo `LICENSE` no repositório.
