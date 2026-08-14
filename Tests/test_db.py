from sqlalchemy import text

from app.db.database import engine


def test_database_connection():
    """The configured test database accepts a simple read-only query."""
    with engine.connect() as connection:
        assert connection.execute(text("SELECT 1")).scalar_one() == 1
