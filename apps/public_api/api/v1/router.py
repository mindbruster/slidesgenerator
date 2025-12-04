"""
Public API v1 Router - aggregates all v1 routes
"""

from fastapi import APIRouter

from apps.public_api.api.v1.slides import router as slides_router
from apps.public_api.api.v1.presentations import router as presentations_router
from apps.public_api.api.v1.export import router as export_router
from apps.public_api.api.v1.api_keys import router as api_keys_router

api_router = APIRouter()

api_router.include_router(slides_router, prefix="/slides", tags=["slides"])
api_router.include_router(presentations_router, prefix="/presentations", tags=["presentations"])
api_router.include_router(export_router, prefix="/export", tags=["export"])
api_router.include_router(api_keys_router, prefix="/keys", tags=["api-keys"])
