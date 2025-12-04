"""
Slide generation endpoints
"""

from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from fastapi.responses import StreamingResponse

from packages.common.core.database import AsyncSessionDep, async_session_factory
from packages.common.schemas import GenerateSlidesRequest, GenerateSlidesResponse
from packages.common.services.file_extractor import file_extractor
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
            theme=request.theme,
        )
        return GenerateSlidesResponse(presentation=presentation)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e


@router.post("/generate/stream")
async def generate_slides_stream(
    request: GenerateSlidesRequest,
) -> StreamingResponse:
    """
    Generate slides with real-time SSE streaming.

    Returns Server-Sent Events showing agent progress:
    - thinking: Agent is processing
    - tool_call: Agent is calling a tool (add_slide, finish_presentation)
    - tool_result: Tool execution completed
    - complete: Generation finished with final presentation
    - error: An error occurred

    Note: Uses own session factory to manage DB lifecycle within the streaming context.
    """

    async def event_stream():
        # Create session inside the generator to ensure proper lifecycle
        async with async_session_factory() as db:
            try:
                generator = SlideGeneratorService(db)
                async for event in generator.generate_stream(
                    text=request.text,
                    slide_count=request.slide_count or 8,
                    title=request.title,
                    theme=request.theme,
                ):
                    yield event.to_sse()
            except Exception as e:
                await db.rollback()
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


@router.post("/generate/upload", response_model=GenerateSlidesResponse)
async def generate_slides_from_file(
    db: AsyncSessionDep,
    file: UploadFile = File(..., description="File to extract text from (PDF, DOCX, TXT, MD)"),
    slide_count: int = Form(default=8, ge=5, le=15, description="Target number of slides"),
    title: str | None = Form(default=None, max_length=255, description="Optional presentation title"),
    theme: str = Form(default="neobrutalism", description="Presentation theme"),
) -> GenerateSlidesResponse:
    """
    Generate slides from an uploaded file.

    Supports: PDF, DOCX, TXT, MD files (max 10MB).
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
        )
        return GenerateSlidesResponse(presentation=presentation)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e


@router.post("/generate/upload/stream")
async def generate_slides_from_file_stream(
    file: UploadFile = File(..., description="File to extract text from (PDF, DOCX, TXT, MD)"),
    slide_count: int = Form(default=8, ge=5, le=15, description="Target number of slides"),
    title: str | None = Form(default=None, max_length=255, description="Optional presentation title"),
    theme: str = Form(default="neobrutalism", description="Presentation theme"),
) -> StreamingResponse:
    """
    Generate slides from an uploaded file with real-time SSE streaming.

    Supports: PDF, DOCX, TXT, MD files (max 10MB).

    Note: Uses own session factory to manage DB lifecycle within the streaming context.
    """
    # Extract text from file first (before streaming starts)
    text = await file_extractor.extract(file)

    async def event_stream():
        # Create session inside the generator to ensure proper lifecycle
        async with async_session_factory() as db:
            try:
                generator = SlideGeneratorService(db)
                async for event in generator.generate_stream(
                    text=text,
                    slide_count=slide_count,
                    title=title,
                    theme=theme,
                ):
                    yield event.to_sse()
            except Exception as e:
                await db.rollback()
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
