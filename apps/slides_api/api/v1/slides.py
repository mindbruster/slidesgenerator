"""
Slide generation endpoints
"""

from fastapi import APIRouter, HTTPException

from packages.common.core.database import AsyncSessionDep
from packages.common.schemas import GenerateSlidesRequest, GenerateSlidesResponse
from packages.common.services.slide_generator import SlideGeneratorService

router = APIRouter()


@router.post("/generate", response_model=GenerateSlidesResponse)
async def generate_slides(
    request: GenerateSlidesRequest,
    db: AsyncSessionDep,
) -> GenerateSlidesResponse:
    """
    Generate slides from input text.

    Takes raw text input and uses LLM to structure it into a presentation
    with 5-15 slides based on content length.
    """
    try:
        generator = SlideGeneratorService(db)
        presentation = await generator.generate(
            text=request.text,
            slide_count=request.slide_count or 8,
            title=request.title,
        )
        return GenerateSlidesResponse(presentation=presentation)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e
