"""manual local migration: create users and tasks tables

Revision ID: local_0001
Revises: None
Create Date: 2026-05-29
"""
from alembic import op
import sqlalchemy as sa

revision = 'local_0001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('nome', sa.String(), nullable=True),
        sa.Column('email', sa.String(), nullable=False),
        sa.Column('hashed_password', sa.String(), nullable=False),
    )
    op.create_index('ix_users_id', 'users', ['id'])
    op.create_index('ix_users_email', 'users', ['email'])

    op.create_table(
        'tasks',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('title', sa.String(), nullable=False),
        sa.Column('description', sa.String(), nullable=True),
        sa.Column('done', sa.Boolean(), nullable=True),
        sa.Column('owner_id', sa.Integer(), sa.ForeignKey('users.id')),
    )
    op.create_index('ix_tasks_id', 'tasks', ['id'])
    op.create_index('ix_tasks_title', 'tasks', ['title'])


def downgrade() -> None:
    op.drop_index('ix_tasks_title', table_name='tasks')
    op.drop_index('ix_tasks_id', table_name='tasks')
    op.drop_table('tasks')

    op.drop_index('ix_users_email', table_name='users')
    op.drop_index('ix_users_id', table_name='users')
    op.drop_table('users')
