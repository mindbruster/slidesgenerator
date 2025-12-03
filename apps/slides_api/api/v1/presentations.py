"""
Presentation CRUD endpoints
"""

from fastapi import APIRouter, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from packages.common.core.database import AsyncSessionDep
from packages.common.models import Presentation, Slide
from packages.common.schemas import (
    PresentationResponse,
    PresentationUpdate,
    SlideUpdate,
)

router = APIRouter()


@router.get("", response_model=list[PresentationResponse])
async def list_presentations(
    db: AsyncSessionDep,
    skip: int = 0,
    limit: int = 50,
) -> list[PresentationResponse]:
    """List all presentations with pagination"""
    query = (
        select(Presentation)
        .options(selectinload(Presentation.slides))
        .offset(skip)
        .limit(limit)
        .order_by(Presentation.created_at.desc())
    )
    result = await db.execute(query)
    presentations = result.scalars().all()
    return [PresentationResponse.model_validate(p) for p in presentations]


@router.get("/{presentation_id}", response_model=PresentationResponse)
async def get_presentation(
    presentation_id: int,
    db: AsyncSessionDep,
) -> PresentationResponse:
    """Get a single presentation by ID"""
    query = (
        select(Presentation)
        .options(selectinload(Presentation.slides))
        .where(Presentation.id == presentation_id)
    )
    result = await db.execute(query)
    presentation = result.scalar_one_or_none()

    if not presentation:
        raise HTTPException(status_code=404, detail="Presentation not found")

    return PresentationResponse.model_validate(presentation)


@router.put("/{presentation_id}", response_model=PresentationResponse)
async def update_presentation(
    presentation_id: int,
    update: PresentationUpdate,
    db: AsyncSessionDep,
) -> PresentationResponse:
    """Update a presentation's metadata"""
    query = (
        select(Presentation)
        .options(selectinload(Presentation.slides))
        .where(Presentation.id == presentation_id)
    )
    result = await db.execute(query)
    presentation = result.scalar_one_or_none()

    if not presentation:
        raise HTTPException(status_code=404, detail="Presentation not found")

    # Update fields
    update_data = update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(presentation, field, value)

    await db.commit()
    await db.refresh(presentation)

    return PresentationResponse.model_validate(presentation)


@router.delete("/{presentation_id}")
async def delete_presentation(
    presentation_id: int,
    db: AsyncSessionDep,
) -> dict[str, str]:
    """Delete a presentation and all its slides"""
    query = select(Presentation).where(Presentation.id == presentation_id)
    result = await db.execute(query)
    presentation = result.scalar_one_or_none()

    if not presentation:
        raise HTTPException(status_code=404, detail="Presentation not found")

    await db.delete(presentation)
    await db.commit()

    return {"status": "deleted", "id": str(presentation_id)}


@router.put("/{presentation_id}/slides/{slide_index}", response_model=PresentationResponse)
async def update_slide(
    presentation_id: int,
    slide_index: int,
    update: SlideUpdate,
    db: AsyncSessionDep,
) -> PresentationResponse:
    """Update a specific slide in a presentation"""
    # Get presentation with slides
    query = (
        select(Presentation)
        .options(selectinload(Presentation.slides))
        .where(Presentation.id == presentation_id)
    )
    result = await db.execute(query)
    presentation = result.scalar_one_or_none()

    if not presentation:
        raise HTTPException(status_code=404, detail="Presentation not found")

    # Find slide by order index
    slide = None
    for s in presentation.slides:
        if s.order == slide_index:
            slide = s
            break

    if not slide:
        raise HTTPException(status_code=404, detail=f"Slide at index {slide_index} not found")

    # Update slide fields
    update_data = update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(slide, field, value)

    await db.commit()
    await db.refresh(presentation)

    return PresentationResponse.model_validate(presentation)
