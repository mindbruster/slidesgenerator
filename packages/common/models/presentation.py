"""
Presentation model - represents a slide deck
"""

from typing import TYPE_CHECKING

from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from packages.common.models.base import Base, TimestampMixin

if TYPE_CHECKING:
    from packages.common.models.slide import Slide


class Presentation(Base, TimestampMixin):
    """
    Presentation model representing a slide deck.

    Attributes:
        id: Primary key
        title: Presentation title
        input_text: Original text input used to generate slides
        theme: Design theme (default for MVP)
        slides: Related slides in this presentation
    """

    __tablename__ = "presentations"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    input_text: Mapped[str] = mapped_column(Text, nullable=False)
    theme: Mapped[str] = mapped_column(String(50), default="default", nullable=False)

    # Relationships
    slides: Mapped[list["Slide"]] = relationship(
        "Slide",
        back_populates="presentation",
        cascade="all, delete-orphan",
        order_by="Slide.order",
    )

    def __repr__(self) -> str:
        return f"<Presentation(id={self.id}, title='{self.title}')>"
