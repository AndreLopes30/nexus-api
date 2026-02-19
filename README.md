# Nexus API

API simples em FastAPI para gerenciar usuários e tarefas.

Quickstart

1. Crie um virtualenv

```bash
python -m venv .venv
.\.venv\Scripts\activate
```

2. Instale dependências

```bash
pip install -r requirements.txt
```

3. Defina `.env` (opcional, por padrão usa `sqlite:///./test.db`)

```
DATABASE_URL=sqlite:///./test.db
SECRET_KEY=uma_chave_segura
```

4. Rode a aplicação

```bash
uvicorn app.main:app --reload
```

5. Rode testes

```bash
pytest -q
```

Docker
------

Para executar a aplicação com Docker e Postgres (modo de desenvolvimento):

1. Construa e levante os serviços:

```bash
docker-compose up --build
```

2. A API ficará disponível em `http://localhost:8000`.

Para parar e remover containers:

```bash
docker-compose down -v
```
