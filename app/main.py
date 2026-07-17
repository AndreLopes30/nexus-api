from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException
from starlette.requests import Request
from starlette.responses import JSONResponse
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

# ----------------------------------------------------------------------
# CORS middleware logo no início para que ele atue inclusive em erros
# ----------------------------------------------------------------------
origins = settings.ALLOWED_ORIGINS.split(",") if settings.ALLOWED_ORIGINS else []

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------------------------------------------------------
# Garantir que todos os erros (incluindo 401/422) sejam retornados como JSON
# ----------------------------------------------------------------------
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors()},
    )

app.include_router(api_router)

@app.get("/")
def health_check():
    return {"status": "ok", "message": "Nexus API está no ar!"}
