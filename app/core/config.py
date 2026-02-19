from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env")
    DATABASE_URL: str = "sqlite:///./test.db"
    SECRET_KEY: str = Field(default="dev-insecure-key")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    SQLALCHEMY_ECHO: bool = False
    LOG_LEVEL: str = "INFO"
    CREATE_TABLES_ON_STARTUP: bool = False


settings = Settings()