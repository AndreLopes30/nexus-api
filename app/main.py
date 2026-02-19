from fastapi import FastAPI
from app.api.api import api_router
from app.db.database import create_tables
from app.core.logging_config import configure_logging
from app.core.config import settings

app = FastAPI(title="Nexus API", version="0.0.1")

app.include_router(api_router)

@app.get("/")
def health_check():
    return {"status": "ok", "message": "Nexus API está no ar!"}

@app.on_event("startup")
def on_startup():
    if getattr(settings, "CREATE_TABLES_ON_STARTUP", False):
        create_tables()

    log_level = getattr(settings, "LOG_LEVEL", "INFO")
    configure_logging(log_level)
