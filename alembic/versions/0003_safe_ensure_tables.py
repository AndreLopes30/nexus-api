"""safe ensure tables

Revision ID: 0003_safe_ensure_tables
Revises: local_0002
Create Date: 2026-05-29
"""
from alembic import op

revision = '0003_safe_ensure_tables'
down_revision = 'local_0002'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Run non-destructive SQL to ensure tables and indexes exist.
    # Works on SQLite and PostgreSQL (CREATE ... IF NOT EXISTS)
    op.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        nome VARCHAR,
        email VARCHAR NOT NULL,
        hashed_password VARCHAR NOT NULL
    );
    CREATE INDEX IF NOT EXISTS ix_users_id ON users (id);
    CREATE INDEX IF NOT EXISTS ix_users_email ON users (email);

    CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY,
        title VARCHAR NOT NULL,
        description VARCHAR,
        done BOOLEAN,
        owner_id INTEGER REFERENCES users(id)
    );
    CREATE INDEX IF NOT EXISTS ix_tasks_id ON tasks (id);
    CREATE INDEX IF NOT EXISTS ix_tasks_title ON tasks (title);
    ''')


def downgrade() -> None:
    # no-op downgrade to avoid accidental drops
    pass
