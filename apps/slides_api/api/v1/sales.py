"""
Sales pitch generation endpoints
Generates sales-focused presentations from structured input
"""

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse

from packages.common.core.database import AsyncSessionDep
from packages.common.schemas import (
    GenerateSalesPitchRequest,
    GenerateSlidesResponse,
    SalesPitchTextResponse,
)
from packages.common.services.sales_generator import SalesContentGenerator
from packages.common.services.slide_generator import SlideGeneratorService

router = APIRouter()


@router.post("/preview", response_model=SalesPitchTextResponse)
async def preview_sales_content(
    request: GenerateSalesPitchRequest,
) -> SalesPitchTextResponse:
    """
    Preview generated sales content before creating slides.

    Takes structured sales input and generates the sales pitch text.
    Useful for letting users review/edit before slide generation.
    """
    try:
        generator = SalesContentGenerator()
        result = await generator.generate(request.pitch)

        return SalesPitchTextResponse(
            generated_text=result.text,
            suggested_title=result.title,
            slide_outline=result.outline,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e


@router.post("/generate", response_model=GenerateSlidesResponse)
async def generate_sales_presentation(
    request: GenerateSalesPitchRequest,
    db: AsyncSessionDep,
) -> GenerateSlidesResponse:
    """
    Generate a complete sales presentation from structured input.

    1. Generates sales-focused content from structured data
    2. Creates slides using the slide generation pipeline
    """
    try:
        # Step 1: Generate sales content
        sales_generator = SalesContentGenerator()
        sales_content = await sales_generator.generate(request.pitch)

        # Step 2: Generate slides from the content
        slide_generator = SlideGeneratorService(db)
        presentation = await slide_generator.generate(
            text=sales_content.text,
            slide_count=request.pitch.slide_count,
            title=request.title or sales_content.title,
            theme=request.pitch.theme,
        )

        return GenerateSlidesResponse(presentation=presentation)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e


@router.post("/generate/stream")
async def generate_sales_presentation_stream(
    request: GenerateSalesPitchRequest,
    db: AsyncSessionDep,
) -> StreamingResponse:
    """
    Generate a sales presentation with real-time SSE streaming.

    First generates sales content, then streams slide creation progress.
    """
    # Step 1: Generate sales content (not streamed - quick)
    sales_generator = SalesContentGenerator()
    sales_content = await sales_generator.generate(request.pitch)

    # Step 2: Stream slide generation
    slide_generator = SlideGeneratorService(db)

    async def event_stream():
        # Send initial event with generated content
        import json

        yield f'data: {json.dumps({"type": "sales_content", "text": sales_content.text[:500] + "...", "title": sales_content.title})}\n\n'

        try:
            async for event in slide_generator.generate_stream(
                text=sales_content.text,
                slide_count=request.pitch.slide_count,
                title=request.title or sales_content.title,
                theme=request.pitch.theme,
            ):
                yield event.to_sse()
        except Exception as e:
            yield f'data: {{"type": "error", "message": "{str(e)}"}}\n\n'

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )
