"""
Template endpoints
"""

from __future__ import annotations

from fastapi import APIRouter, HTTPException, Query, Response
from fastapi.responses import StreamingResponse

from packages.common.core.database import AsyncSessionDep, async_session_factory
from packages.common.schemas.template_schema import (
    CategoryCount,
    TemplateCreate,
    TemplateGenerateRequest,
    TemplateListResponse,
    TemplateResponse,
    TemplateUpdate,
)
from packages.common.schemas.presentation_schema import GenerateSlidesResponse
from packages.common.services.template_service import TemplateService
from packages.common.services.slide_generator import SlideGeneratorService

router = APIRouter()


@router.get("", response_model=list[TemplateListResponse])
async def list_templates(
    db: AsyncSessionDep,
    category: str | None = Query(default=None, description="Filter by category"),
    theme: str | None = Query(default=None, description="Filter by theme"),
    search: str | None = Query(default=None, description="Search by name/description"),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=50, ge=1, le=100),
) -> list[TemplateListResponse]:
    """
    List available templates with optional filters.
    Returns templates sorted by popularity.
    """
    service = TemplateService(db)
    templates = await service.list(
        category=category,
        theme=theme,
        search=search,
        skip=skip,
        limit=limit,
    )
    return [service.to_list_response(t) for t in templates]


@router.get("/categories", response_model=list[CategoryCount])
async def get_categories(db: AsyncSessionDep) -> list[CategoryCount]:
    """Get all template categories with counts"""
    service = TemplateService(db)
    return await service.get_categories()


@router.get("/popular", response_model=list[TemplateListResponse])
async def get_popular_templates(
    db: AsyncSessionDep,
    limit: int = Query(default=10, ge=1, le=50),
) -> list[TemplateListResponse]:
    """Get most popular templates"""
    service = TemplateService(db)
    templates = await service.get_popular(limit=limit)
    return [service.to_list_response(t) for t in templates]


@router.get("/{template_id}", response_model=TemplateResponse)
async def get_template(
    template_id: int,
    db: AsyncSessionDep,
) -> TemplateResponse:
    """Get a template by ID with all slides"""
    service = TemplateService(db)
    template = await service.get_by_id(template_id)

    if not template:
        raise HTTPException(status_code=404, detail="Template not found")

    return service.to_response(template)


@router.post("", response_model=TemplateResponse, status_code=201)
async def create_template(
    data: TemplateCreate,
    db: AsyncSessionDep,
) -> TemplateResponse:
    """Create a new user template"""
    service = TemplateService(db)
    template = await service.create(data)
    return service.to_response(template)


@router.patch("/{template_id}", response_model=TemplateResponse)
async def update_template(
    template_id: int,
    data: TemplateUpdate,
    db: AsyncSessionDep,
) -> TemplateResponse:
    """Update a template (user templates only)"""
    service = TemplateService(db)
    template = await service.get_by_id(template_id)

    if not template:
        raise HTTPException(status_code=404, detail="Template not found")

    if template.is_system:
        raise HTTPException(status_code=403, detail="Cannot modify system templates")

    template = await service.update(template, data)
    return service.to_response(template)


@router.delete("/{template_id}", status_code=204, response_class=Response)
async def delete_template(
    template_id: int,
    db: AsyncSessionDep,
):
    """Delete a template (user templates only)"""
    service = TemplateService(db)
    template = await service.get_by_id(template_id)

    if not template:
        raise HTTPException(status_code=404, detail="Template not found")

    try:
        await service.delete(template)
    except ValueError as e:
        raise HTTPException(status_code=403, detail=str(e)) from e

    return Response(status_code=204)


@router.post("/{template_id}/generate", response_model=GenerateSlidesResponse)
async def generate_from_template(
    template_id: int,
    request: TemplateGenerateRequest,
    db: AsyncSessionDep,
) -> GenerateSlidesResponse:
    """
    Generate a presentation using a template as structure guide.
    The AI follows the template's slide order and types.
    """
    template_service = TemplateService(db)
    template = await template_service.get_by_id(template_id)

    if not template:
        raise HTTPException(status_code=404, detail="Template not found")

    # Build template-aware prompt
    template_prompt = template_service.build_generation_prompt(template, request)

    # Generate using existing service with template context
    generator = SlideGeneratorService(db)
    presentation = await generator.generate(
        text=request.user_content,
        slide_count=len(template.slides),
        theme=request.theme or template.theme,
        template_prompt=template_prompt,
    )

    # Track usage
    await template_service.increment_usage(template_id)

    return GenerateSlidesResponse(presentation=presentation)


@router.post("/{template_id}/generate/stream")
async def generate_from_template_stream(
    template_id: int,
    request: TemplateGenerateRequest,
) -> StreamingResponse:
    """
    Generate a presentation from template with real-time SSE streaming.

    Returns Server-Sent Events showing agent progress:
    - thinking: Agent is processing
    - tool_call: Agent is calling a tool (add_slide, finish_presentation)
    - tool_result: Tool execution completed
    - complete: Generation finished with final presentation
    - error: An error occurred
    """

    async def event_stream():
        async with async_session_factory() as db:
            try:
                # Get template
                template_service = TemplateService(db)
                template = await template_service.get_by_id(template_id)

                if not template:
                    yield f'data: {{"type": "error", "message": "Template not found"}}\n\n'
                    return

                # Build template-aware prompt
                template_prompt = template_service.build_generation_prompt(template, request)

                # Calculate slide count (excluding any excluded slides)
                slide_count = len(template.slides)
                if request.excluded_slides:
                    slide_count -= len(request.excluded_slides)

                # Generate using streaming
                generator = SlideGeneratorService(db)
                async for event in generator.generate_stream(
                    text=request.user_content,
                    slide_count=slide_count,
                    theme=request.theme or template.theme,
                    template_prompt=template_prompt,
                ):
                    yield event.to_sse()

                # Track usage after successful generation
                await template_service.increment_usage(template_id)

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
