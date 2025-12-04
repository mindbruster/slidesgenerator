"""
Public API - Slide generation endpoints
"""

from fastapi import APIRouter, File, Form, HTTPException, UploadFile

from packages.common.core.database import AsyncSessionDep
from packages.common.schemas import GenerateSlidesRequest, GenerateSlidesResponse
from packages.common.services.file_extractor import file_extractor
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


@router.post("/generate/upload", response_model=GenerateSlidesResponse)
async def generate_slides_from_file(
    db: AsyncSessionDep,
    api_key: RequireAPIKey,
    file: UploadFile = File(..., description="File to extract text from (PDF, DOCX, TXT, MD)"),
    slide_count: int = Form(default=8, ge=5, le=15, description="Target number of slides"),
    title: str | None = Form(default=None, max_length=255, description="Optional presentation title"),
    theme: str = Form(default="neobrutalism", description="Presentation theme"),
) -> GenerateSlidesResponse:
    """
    Generate slides from an uploaded file.

    Supports: PDF, DOCX, TXT, MD files (max 10MB).

    Requires X-API-Key header for authentication.
    """
    # Extract text from file
    text = await file_extractor.extract(file)

    try:
        generator = SlideGeneratorService(db)
        presentation = await generator.generate(
            text=text,
            slide_count=slide_count,
            title=title,
            theme=theme,
            api_key_id=api_key.id,
        )
        return GenerateSlidesResponse(presentation=presentation)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e
