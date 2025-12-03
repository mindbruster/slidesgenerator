"""
Decksnap Slides API
FastAPI application entry point
"""

from contextlib import asynccontextmanager
from typing import Any

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from packages.common.core.config import settings
from packages.common.core.logging import setup_logging

from apps.slides_api.api.v1.router import api_router


@asynccontextmanager
async def lifespan(app: FastAPI) -> Any:
    """Application lifespan handler"""
    # Startup
    setup_logging()
    yield
    # Shutdown
    pass


app = FastAPI(
    title="Decksnap API",
    description="One-click slide generation from text",
    version="0.1.0",
    lifespan=lifespan,
    docs_url="/docs" if settings.debug else None,
    redoc_url="/redoc" if settings.debug else None,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router
app.include_router(api_router, prefix=settings.api_v1_prefix)


@app.get("/health")
async def health_check() -> dict[str, str]:
    """Health check endpoint"""
    return {"status": "healthy", "service": "decksnap-api"}
