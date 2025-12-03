"""
Slide generation endpoints
"""

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse

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


@router.post("/generate/stream")
async def generate_slides_stream(
    request: GenerateSlidesRequest,
    db: AsyncSessionDep,
) -> StreamingResponse:
    """
    Generate slides with real-time SSE streaming.

    Returns Server-Sent Events showing agent progress:
    - thinking: Agent is processing
    - tool_call: Agent is calling a tool (add_slide, finish_presentation)
    - tool_result: Tool execution completed
    - complete: Generation finished with final presentation
    - error: An error occurred
    """
    generator = SlideGeneratorService(db)

    async def event_stream():
        try:
            async for event in generator.generate_stream(
                text=request.text,
                slide_count=request.slide_count or 8,
                title=request.title,
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
