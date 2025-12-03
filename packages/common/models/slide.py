"""
Slide model - represents a single slide in a presentation
"""

from typing import TYPE_CHECKING, Any, Literal

from sqlalchemy import JSON, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from packages.common.models.base import Base, TimestampMixin

if TYPE_CHECKING:
    from packages.common.models.presentation import Presentation


SlideType = Literal["title", "content", "bullets", "quote", "section", "chart"]
SlideLayout = Literal["left", "center", "right", "split"]
ChartType = Literal["bar", "line", "pie", "donut", "area", "horizontal_bar"]


class Slide(Base, TimestampMixin):
    """
    Slide model representing a single slide in a presentation.

    Attributes:
        id: Primary key
        presentation_id: Foreign key to parent presentation
        type: Slide type (title, content, bullets, quote, section, chart)
        title: Slide title
        subtitle: Optional subtitle
        body: Main text content
        bullets: List of bullet points (JSON)
        quote: Quote text for quote slides
        attribution: Quote attribution
        layout: Layout type (left, center, right, split)
        order: Position in presentation
        chart_type: Type of chart (bar, line, pie, donut, area, horizontal_bar)
        chart_data: Chart data points (JSON array)
        chart_config: Chart configuration options (JSON object)
    """

    __tablename__ = "slides"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    presentation_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("presentations.id", ondelete="CASCADE"),
        nullable=False,
    )

    # Slide content
    type: Mapped[str] = mapped_column(String(50), default="content", nullable=False)
    title: Mapped[str | None] = mapped_column(String(255), nullable=True)
    subtitle: Mapped[str | None] = mapped_column(String(255), nullable=True)
    body: Mapped[str | None] = mapped_column(Text, nullable=True)
    bullets: Mapped[list[str] | None] = mapped_column(JSON, nullable=True)
    quote: Mapped[str | None] = mapped_column(Text, nullable=True)
    attribution: Mapped[str | None] = mapped_column(String(255), nullable=True)

    # Chart fields
    chart_type: Mapped[str | None] = mapped_column(String(50), nullable=True)
    chart_data: Mapped[list[dict[str, Any]] | None] = mapped_column(JSON, nullable=True)
    chart_config: Mapped[dict[str, Any] | None] = mapped_column(JSON, nullable=True)

    # Layout
    layout: Mapped[str] = mapped_column(String(50), default="center", nullable=False)
    order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    # Relationships
    presentation: Mapped["Presentation"] = relationship(
        "Presentation",
        back_populates="slides",
    )

    def __repr__(self) -> str:
        return f"<Slide(id={self.id}, type='{self.type}', order={self.order})>"
