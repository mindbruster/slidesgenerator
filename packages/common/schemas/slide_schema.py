"""
Slide schemas for API request/response validation
"""

from typing import Literal

from pydantic import BaseModel, Field


SlideType = Literal["title", "content", "bullets", "quote", "section"]
SlideLayout = Literal["left", "center", "right", "split"]


class SlideBase(BaseModel):
    """Base slide schema with common fields"""

    type: SlideType = "content"
    title: str | None = None
    subtitle: str | None = None
    body: str | None = None
    bullets: list[str] | None = None
    quote: str | None = None
    attribution: str | None = None
    layout: SlideLayout = "center"
    order: int = 0


class SlideCreate(SlideBase):
    """Schema for creating a new slide"""

    pass


class SlideUpdate(BaseModel):
    """Schema for updating a slide (all fields optional)"""

    type: SlideType | None = None
    title: str | None = None
    subtitle: str | None = None
    body: str | None = None
    bullets: list[str] | None = None
    quote: str | None = None
    attribution: str | None = None
    layout: SlideLayout | None = None
    order: int | None = None


class SlideResponse(SlideBase):
    """Schema for slide response"""

    id: int
    presentation_id: int

    model_config = {"from_attributes": True}


class SlideInPresentation(SlideBase):
    """Schema for slides nested in presentation response"""

    id: int

    model_config = {"from_attributes": True}
