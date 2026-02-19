from pydantic import BaseSettings, Field


class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./test.db"
    SECRET_KEY: str = Field(default="dev-insecure-key", env="SECRET_KEY")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    SQLALCHEMY_ECHO: bool = False
    LOG_LEVEL: str = "INFO"
    CREATE_TABLES_ON_STARTUP: bool = False

    class Config:
        env_file = ".env"


settings = Settings()
