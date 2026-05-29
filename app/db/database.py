from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

DATABASE_URL = settings.DATABASE_URL

engine = create_engine(DATABASE_URL, echo=settings.SQLALCHEMY_ECHO)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_tables():
    """Deprecated: prefer using Alembic migrations.

    This function is kept for backward compatibility but will raise
    a RuntimeError to encourage using Alembic.
    """
    raise RuntimeError(
        "Use Alembic for schema migrations: `pip install alembic` and run `alembic upgrade head`."
    )
