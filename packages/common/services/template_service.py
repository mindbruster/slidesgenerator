"""
Template Service - business logic for template operations
DRY: Shared by slides_api and public_api
"""

from __future__ import annotations

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from packages.common.models.template import Template, TemplateSlide
from packages.common.schemas.template_schema import (
    CategoryCount,
    TemplateCreate,
    TemplateGenerateRequest,
    TemplateListResponse,
    TemplateResponse,
    TemplateUpdate,
)


class TemplateService:
    """Service for template CRUD and generation operations"""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, template_id: int) -> Template | None:
        """Get a template by ID with slides loaded"""
        query = (
            select(Template)
            .options(selectinload(Template.slides))
            .where(Template.id == template_id)
        )
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def list(
        self,
        category: str | None = None,
        theme: str | None = None,
        search: str | None = None,
        skip: int = 0,
        limit: int = 50,
    ) -> list[Template]:
        """
        List templates with optional filters.
        Only returns public templates and system templates.
        """
        query = (
            select(Template)
            .options(selectinload(Template.slides))
            .where(Template.is_public == True)  # noqa: E712
            .offset(skip)
            .limit(limit)
            .order_by(Template.usage_count.desc(), Template.name)
        )

        if category:
            query = query.where(Template.category == category)

        if theme:
            query = query.where(Template.theme == theme)

        if search:
            search_filter = f"%{search}%"
            query = query.where(
                Template.name.ilike(search_filter) | Template.description.ilike(search_filter)
            )

        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def get_categories(self) -> list[CategoryCount]:
        """Get all categories with template counts"""
        query = (
            select(Template.category, func.count(Template.id).label("count"))
            .where(Template.is_public == True)  # noqa: E712
            .group_by(Template.category)
            .order_by(func.count(Template.id).desc())
        )
        result = await self.db.execute(query)
        return [CategoryCount(category=row.category, count=row.count) for row in result.all()]

    async def get_popular(self, limit: int = 10) -> list[Template]:
        """Get most popular templates by usage"""
        query = (
            select(Template)
            .options(selectinload(Template.slides))
            .where(Template.is_public == True)  # noqa: E712
            .order_by(Template.usage_count.desc())
            .limit(limit)
        )
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def create(self, data: TemplateCreate) -> Template:
        """Create a new template with slides"""
        template = Template(
            name=data.name,
            description=data.description,
            category=data.category,
            theme=data.theme,
            thumbnail_url=data.thumbnail_url,
            tags=data.tags,
            is_public=data.is_public,
            is_system=False,
            difficulty_level=data.difficulty_level,
            estimated_time=data.estimated_time,
            industry_tags=data.industry_tags,
            popularity_score=data.popularity_score,
        )

        for slide_data in data.slides:
            slide = TemplateSlide(
                order=slide_data.order,
                slide_type=slide_data.slide_type,
                layout=slide_data.layout,
                placeholder_title=slide_data.placeholder_title,
                placeholder_body=slide_data.placeholder_body,
                placeholder_bullets=slide_data.placeholder_bullets,
                ai_instructions=slide_data.ai_instructions,
                is_required=slide_data.is_required,
            )
            template.slides.append(slide)

        self.db.add(template)
        await self.db.commit()
        await self.db.refresh(template)
        return template

    async def update(self, template: Template, data: TemplateUpdate) -> Template:
        """Update template metadata (not slides)"""
        update_data = data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(template, field, value)

        await self.db.commit()
        await self.db.refresh(template)
        return template

    async def delete(self, template: Template) -> None:
        """Delete a template and all its slides"""
        if template.is_system:
            raise ValueError("Cannot delete system templates")

        await self.db.delete(template)
        await self.db.commit()

    async def increment_usage(self, template_id: int) -> None:
        """Increment template usage counter"""
        template = await self.get_by_id(template_id)
        if template:
            template.usage_count += 1
            await self.db.commit()

    def to_response(self, template: Template) -> TemplateResponse:
        """Convert template model to response schema"""
        return TemplateResponse.model_validate(template)

    def to_list_response(self, template: Template) -> TemplateListResponse:
        """Convert template model to list response schema"""
        return TemplateListResponse(
            id=template.id,
            name=template.name,
            description=template.description,
            category=template.category,
            theme=template.theme,
            thumbnail_url=template.thumbnail_url,
            is_system=template.is_system,
            usage_count=template.usage_count,
            slide_count=len(template.slides) if template.slides else 0,
            tags=template.tags,
            difficulty_level=template.difficulty_level,
            estimated_time=template.estimated_time,
            industry_tags=template.industry_tags,
            popularity_score=template.popularity_score,
        )

    def build_generation_prompt(
        self,
        template: Template,
        request: TemplateGenerateRequest,
    ) -> str:
        """
        Build system prompt for AI generation using template structure.
        Called by SlideGeneratorService.
        """
        slide_descriptions = []
        for slide in template.slides:
            if request.excluded_slides and slide.order in request.excluded_slides:
                if not slide.is_required:
                    continue

            desc = f"Slide {slide.order}: {slide.slide_type.upper()}"
            if slide.placeholder_title:
                title = self._apply_variables(slide.placeholder_title, request.variables)
                desc += f"\n  Title: {title}"
            if slide.ai_instructions:
                desc += f"\n  Instructions: {slide.ai_instructions}"
            slide_descriptions.append(desc)

        slide_structure = "\n\n".join(slide_descriptions)

        return f"""You are creating a presentation using the "{template.name}" template.

TEMPLATE STRUCTURE (follow this slide order and types exactly):

{slide_structure}

USER'S CONTENT:
{request.user_content}

INSTRUCTIONS:
1. Create exactly the slides listed above in the specified order
2. Use the user's content to fill each slide appropriately
3. Follow the ai_instructions for each slide
4. Match the {template.category} category style
5. Keep content professional and engaging
"""

    def _apply_variables(self, text: str, variables: dict[str, str] | None) -> str:
        """Replace {{variable}} placeholders with values"""
        if not variables:
            return text

        result = text
        for key, value in variables.items():
            result = result.replace(f"{{{{{key}}}}}", value)
        return result
