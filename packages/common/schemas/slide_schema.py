"""
Slide schemas for API request/response validation
"""

from typing import Any, Literal

from pydantic import BaseModel, Field


SlideType = Literal["title", "content", "bullets", "quote", "section", "chart"]
SlideLayout = Literal["left", "center", "right", "split"]
ChartType = Literal["bar", "line", "pie", "donut", "area", "horizontal_bar"]


class ChartDataPoint(BaseModel):
    """Single data point for a chart"""

    label: str
    value: float
    color: str | None = None


class ChartConfig(BaseModel):
    """Chart display configuration"""

    show_legend: bool = True
    show_values: bool = True
    y_axis_label: str | None = None
    x_axis_label: str | None = None


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
    # Chart fields
    chart_type: ChartType | None = None
    chart_data: list[ChartDataPoint] | None = None
    chart_config: ChartConfig | None = None


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
    # Chart fields
    chart_type: ChartType | None = None
    chart_data: list[ChartDataPoint] | None = None
    chart_config: ChartConfig | None = None


class SlideResponse(SlideBase):
    """Schema for slide response"""

    id: int
    presentation_id: int

    model_config = {"from_attributes": True}


class SlideInPresentation(SlideBase):
    """Schema for slides nested in presentation response"""

    id: int

    model_config = {"from_attributes": True}
