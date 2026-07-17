from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.api import api_router
from app.db.database import create_tables
from app.core.logging_config import configure_logging
from app.core.config import settings

@asynccontextmanager
async def lifespan(app: FastAPI):
    if getattr(settings, "CREATE_TABLES_ON_STARTUP", False):
        create_tables()
    
    log_level = getattr(settings, "LOG_LEVEL", "INFO")
    configure_logging(log_level)
    
    yield

app = FastAPI(title="Nexus API", version="0.0.1", lifespan=lifespan)

origins = settings.ALLOWED_ORIGINS.split(",") if settings.ALLOWED_ORIGINS else []

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
