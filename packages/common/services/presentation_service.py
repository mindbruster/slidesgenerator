"""
Presentation Service - shared business logic for presentations
DRY: Used by both slides_api and public_api
"""

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from packages.common.models import Presentation, Slide
from packages.common.schemas import (
    PresentationResponse,
    PresentationUpdate,
    SlideUpdate,
)


class PresentationService:
    """Service for presentation CRUD operations"""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(
        self,
        presentation_id: int,
        api_key_id: int | None = None,
    ) -> Presentation | None:
        """
        Get a presentation by ID with slides loaded.
        If api_key_id provided, only returns if owned by that key.
        """
        query = (
            select(Presentation)
            .options(selectinload(Presentation.slides))
            .where(Presentation.id == presentation_id)
        )

        # Scope to API key if provided
        if api_key_id is not None:
            query = query.where(Presentation.api_key_id == api_key_id)

        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def list(
        self,
        skip: int = 0,
        limit: int = 50,
        api_key_id: int | None = None,
    ) -> list[Presentation]:
        """
        List presentations with pagination.
        If api_key_id provided, only returns those owned by that key.
        """
        query = (
            select(Presentation)
            .options(selectinload(Presentation.slides))
            .offset(skip)
            .limit(limit)
            .order_by(Presentation.created_at.desc())
        )

        # Scope to API key if provided
        if api_key_id is not None:
            query = query.where(Presentation.api_key_id == api_key_id)

        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def update(
        self,
        presentation: Presentation,
        data: PresentationUpdate,
    ) -> Presentation:
        """Update a presentation's metadata"""
        update_data = data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(presentation, field, value)

        await self.db.commit()
        await self.db.refresh(presentation)
        return presentation

    async def delete(self, presentation: Presentation) -> None:
        """Delete a presentation and all its slides"""
        await self.db.delete(presentation)
        await self.db.commit()

    async def update_slide(
        self,
        presentation: Presentation,
        slide_index: int,
        data: SlideUpdate,
    ) -> tuple[Presentation, Slide] | None:
        """
        Update a specific slide in a presentation.
        Returns (presentation, slide) or None if slide not found.
        """
        # Find slide by order index
        slide = None
        for s in presentation.slides:
            if s.order == slide_index:
                slide = s
                break

        if not slide:
            return None

        # Update slide fields
        update_data = data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(slide, field, value)

        await self.db.commit()
        await self.db.refresh(presentation)
        return presentation, slide

    def to_response(self, presentation: Presentation) -> PresentationResponse:
        """Convert a presentation model to response schema"""
        return PresentationResponse.model_validate(presentation)
