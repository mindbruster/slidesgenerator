"""
Template schemas for API request/response validation
"""

from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field

from packages.common.schemas.slide_schema import SlideType, SlideLayout

TemplateCategory = Literal[
    "business",
    "education",
    "marketing",
    "technology",
    "creative",
    "personal",
    "healthcare",
    "finance",
    "sales",
    "nonprofit",
]

DifficultyLevel = Literal["beginner", "intermediate", "advanced"]


class TemplateSlideBase(BaseModel):
    """Base schema for template slides"""

    slide_type: SlideType
    layout: SlideLayout = "center"
    placeholder_title: str | None = None
    placeholder_body: str | None = None
    placeholder_bullets: list[str] | None = None
    ai_instructions: str | None = Field(
        default=None, description="Guidance for AI when generating this slide"
    )
    is_required: bool = True


class TemplateSlideCreate(TemplateSlideBase):
    """Schema for creating a template slide"""

    order: int = Field(..., ge=1, description="Slide position (1-based)")


class TemplateSlideResponse(TemplateSlideBase):
    """Schema for template slide in responses"""

    id: int
    order: int

    model_config = {"from_attributes": True}


class TemplateBase(BaseModel):
    """Base schema for templates"""

    name: str = Field(..., min_length=1, max_length=255)
    description: str | None = None
    category: TemplateCategory
    theme: str = "neobrutalism"
    thumbnail_url: str | None = None
    tags: list[str] | None = None
    difficulty_level: DifficultyLevel = "beginner"
    estimated_time: int = Field(default=10, ge=1, le=120, description="Estimated completion time in minutes")
    industry_tags: list[str] | None = Field(default=None, description="Industry-specific tags for filtering")
    popularity_score: int = Field(default=0, ge=0, description="Calculated popularity score")


class TemplateCreate(TemplateBase):
    """Schema for creating a template"""

    slides: list[TemplateSlideCreate] = Field(
        ..., min_length=1, description="At least one slide required"
    )
    is_public: bool = True


class TemplateUpdate(BaseModel):
    """Schema for updating a template (all fields optional)"""

    name: str | None = Field(default=None, min_length=1, max_length=255)
    description: str | None = None
    category: TemplateCategory | None = None
    theme: str | None = None
    thumbnail_url: str | None = None
    tags: list[str] | None = None
    is_public: bool | None = None
    difficulty_level: DifficultyLevel | None = None
    estimated_time: int | None = Field(default=None, ge=1, le=120)
    industry_tags: list[str] | None = None


class TemplateResponse(TemplateBase):
    """Schema for template in responses"""

    id: int
    is_system: bool
    is_public: bool
    usage_count: int
    slides: list[TemplateSlideResponse]

    model_config = {"from_attributes": True}


class TemplateListResponse(BaseModel):
    """Schema for listing templates (without full slide details)"""

    id: int
    name: str
    description: str | None
    category: TemplateCategory
    theme: str
    thumbnail_url: str | None
    is_system: bool
    usage_count: int
    slide_count: int
    tags: list[str] | None
    difficulty_level: DifficultyLevel
    estimated_time: int
    industry_tags: list[str] | None
    popularity_score: int

    model_config = {"from_attributes": True}


class TemplateGenerateRequest(BaseModel):
    """Schema for generating presentation from template"""

    user_content: str = Field(
        ..., min_length=10, description="User's content to fill the template"
    )
    theme: str | None = Field(default=None, description="Override template's default theme")
    variables: dict[str, str] | None = Field(
        default=None, description="Variable replacements for placeholders"
    )
    excluded_slides: list[int] | None = Field(
        default=None, description="Slide orders to exclude (only non-required)"
    )


class CategoryCount(BaseModel):
    """Category with template count"""

    category: TemplateCategory
    count: int
