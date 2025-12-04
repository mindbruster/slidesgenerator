"""
Decksnap Public API
FastAPI application entry point for external API access
"""

from contextlib import asynccontextmanager
from typing import Any

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from packages.common.core.config import settings
from packages.common.core.logging import setup_logging

from apps.public_api.api.v1.router import api_router


@asynccontextmanager
async def lifespan(app: FastAPI) -> Any:
    """Application lifespan handler"""
    # Startup
    setup_logging()
    yield
    # Shutdown
    pass


app = FastAPI(
    title="Decksnap Public API",
    description="External API for programmatic slide generation. Authenticate with X-API-Key header.",
    version="0.1.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS middleware - more permissive for public API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Public API allows all origins
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router
app.include_router(api_router, prefix=settings.api_v1_prefix)


@app.get("/health")
async def health_check() -> dict[str, str]:
    """Health check endpoint"""
    return {"status": "healthy", "service": "decksnap-public-api"}
