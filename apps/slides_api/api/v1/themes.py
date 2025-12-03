"""
Themes API endpoint - list available presentation themes
"""

from fastapi import APIRouter

from packages.common.themes import get_available_themes

router = APIRouter()


@router.get("")
async def list_themes():
    """List all available presentation themes."""
    return {"themes": get_available_themes()}
