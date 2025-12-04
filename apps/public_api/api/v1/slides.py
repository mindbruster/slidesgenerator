"""
Public API - Slide generation endpoints
"""

from fastapi import APIRouter, HTTPException

from packages.common.core.database import AsyncSessionDep
from packages.common.schemas import GenerateSlidesRequest, GenerateSlidesResponse
from packages.common.services.slide_generator import SlideGeneratorService

from apps.public_api.dependencies import RequireAPIKey

router = APIRouter()


@router.post("/generate", response_model=GenerateSlidesResponse)
async def generate_slides(
    request: GenerateSlidesRequest,
    db: AsyncSessionDep,
    api_key: RequireAPIKey,
) -> GenerateSlidesResponse:
    """
    Generate slides from input text.

    Requires X-API-Key header for authentication.
    Takes raw text input and uses LLM to structure it into a presentation.
    """
    try:
        generator = SlideGeneratorService(db)
        presentation = await generator.generate(
            text=request.text,
            slide_count=request.slide_count or 8,
            title=request.title,
            theme=request.theme,
            api_key_id=api_key.id,
        )
        return GenerateSlidesResponse(presentation=presentation)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e
