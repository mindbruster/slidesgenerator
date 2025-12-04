"""
Presentation schemas for API request/response validation
"""

from datetime import datetime

from pydantic import BaseModel, Field

from packages.common.schemas.slide_schema import SlideCreate, SlideInPresentation


class PresentationBase(BaseModel):
    """Base presentation schema"""

    title: str = Field(..., min_length=1, max_length=255)
    theme: str = "default"


class PresentationCreate(PresentationBase):
    """Schema for creating a presentation"""

    input_text: str = Field(..., min_length=1)
    slides: list[SlideCreate] = []


class PresentationUpdate(BaseModel):
    """Schema for updating a presentation (all fields optional)"""

    title: str | None = None
    theme: str | None = None


class PresentationResponse(PresentationBase):
    """Schema for presentation response"""

    id: int
    input_text: str
    slides: list[SlideInPresentation] = []
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class PresentationListResponse(BaseModel):
    """Schema for presentation list item"""

    id: int
    title: str
    theme: str
    slide_count: int
    created_at: datetime
    updated_at: datetime


# Generation schemas


class SalesContext(BaseModel):
    """Context for sales-focused slide generation"""

    industry: str | None = Field(
        default=None,
        max_length=100,
        description="Target industry (e.g., SaaS, Healthcare, E-commerce, Finance, Real Estate)",
    )
    audience: str | None = Field(
        default=None,
        max_length=100,
        description="Target audience (e.g., C-Suite, Investors, Technical Team, End Users)",
    )
    tone: str | None = Field(
        default="professional",
        description="Presentation tone: professional, persuasive, casual, technical, inspirational",
    )
    goal: str | None = Field(
        default=None,
        max_length=200,
        description="Sales goal (e.g., Close deal, Get funding, Product demo, Onboarding)",
    )


class GenerateSlidesRequest(BaseModel):
    """Request schema for slide generation"""

    text: str = Field(
        ...,
        min_length=50,
        max_length=50000,
        description="Text content to generate slides from",
    )
    slide_count: int | None = Field(
        default=8,
        ge=5,
        le=15,
        description="Target number of slides (5-15)",
    )
    title: str | None = Field(
        default=None,
        max_length=255,
        description="Optional presentation title (auto-generated if not provided)",
    )
    theme: str = Field(
        default="neobrutalism",
        description="Presentation theme (neobrutalism, corporate, minimal, dark)",
    )
    sales_context: SalesContext | None = Field(
        default=None,
        description="Optional sales context for generating sales-focused content",
    )


class GenerateSlidesResponse(BaseModel):
    """Response schema for slide generation"""

    presentation: PresentationResponse
