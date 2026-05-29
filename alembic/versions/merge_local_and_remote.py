"""merge heads: local_0001 + c904c0ffdb8a

Revision ID: merge_local_and_remote
Revises: c904c0ffdb8a, local_0001
Create Date: 2026-05-29
"""
from alembic import op

revision = 'merge_local_and_remote'
down_revision = ('c904c0ffdb8a', 'local_0001')
branch_labels = None
depends_on = None


def upgrade() -> None:
    # merge migration: no-op. This brings multiple heads together.
    pass


def downgrade() -> None:
    pass
