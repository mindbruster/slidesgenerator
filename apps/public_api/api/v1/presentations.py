"""
Public API - Presentation CRUD endpoints
"""

from fastapi import APIRouter, HTTPException

from packages.common.core.database import AsyncSessionDep
from packages.common.schemas import (
    PresentationResponse,
    PresentationUpdate,
    SlideUpdate,
)
from packages.common.services.presentation_service import PresentationService

from apps.public_api.dependencies import RequireAPIKey

router = APIRouter()


@router.get("", response_model=list[PresentationResponse])
async def list_presentations(
    db: AsyncSessionDep,
    api_key: RequireAPIKey,
    skip: int = 0,
    limit: int = 50,
) -> list[PresentationResponse]:
    """
    List presentations created with this API key.

    Results are scoped to the authenticated API key.
    """
    service = PresentationService(db)
    presentations = await service.list(skip=skip, limit=limit, api_key_id=api_key.id)
    return [service.to_response(p) for p in presentations]


@router.get("/{presentation_id}", response_model=PresentationResponse)
async def get_presentation(
    presentation_id: int,
    db: AsyncSessionDep,
    api_key: RequireAPIKey,
) -> PresentationResponse:
    """
    Get a single presentation by ID.

    Only returns presentations owned by the authenticated API key.
    """
    service = PresentationService(db)
    presentation = await service.get_by_id(presentation_id, api_key_id=api_key.id)

    if not presentation:
        raise HTTPException(status_code=404, detail="Presentation not found")

    return service.to_response(presentation)


@router.put("/{presentation_id}", response_model=PresentationResponse)
async def update_presentation(
    presentation_id: int,
    update: PresentationUpdate,
    db: AsyncSessionDep,
    api_key: RequireAPIKey,
) -> PresentationResponse:
    """
    Update a presentation's metadata.

    Only updates presentations owned by the authenticated API key.
    """
    service = PresentationService(db)
    presentation = await service.get_by_id(presentation_id, api_key_id=api_key.id)

    if not presentation:
        raise HTTPException(status_code=404, detail="Presentation not found")

    updated = await service.update(presentation, update)
    return service.to_response(updated)


@router.delete("/{presentation_id}")
async def delete_presentation(
    presentation_id: int,
    db: AsyncSessionDep,
    api_key: RequireAPIKey,
) -> dict[str, str]:
    """
    Delete a presentation and all its slides.

    Only deletes presentations owned by the authenticated API key.
    """
    service = PresentationService(db)
    presentation = await service.get_by_id(presentation_id, api_key_id=api_key.id)

    if not presentation:
        raise HTTPException(status_code=404, detail="Presentation not found")

    await service.delete(presentation)
    return {"status": "deleted", "id": str(presentation_id)}


@router.put("/{presentation_id}/slides/{slide_index}", response_model=PresentationResponse)
async def update_slide(
    presentation_id: int,
    slide_index: int,
    update: SlideUpdate,
    db: AsyncSessionDep,
    api_key: RequireAPIKey,
) -> PresentationResponse:
    """
    Update a specific slide in a presentation.

    Only updates slides in presentations owned by the authenticated API key.
    """
    service = PresentationService(db)
    presentation = await service.get_by_id(presentation_id, api_key_id=api_key.id)

    if not presentation:
        raise HTTPException(status_code=404, detail="Presentation not found")

    result = await service.update_slide(presentation, slide_index, update)

    if not result:
        raise HTTPException(status_code=404, detail=f"Slide at index {slide_index} not found")

    updated_presentation, _ = result
    return service.to_response(updated_presentation)
