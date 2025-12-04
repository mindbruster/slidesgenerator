"""
Presentation model - represents a slide deck
"""

from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from packages.common.models.base import Base, TimestampMixin

if TYPE_CHECKING:
    from packages.common.models.api_key import APIKey
    from packages.common.models.slide import Slide


class Presentation(Base, TimestampMixin):
    """
    Presentation model representing a slide deck.

    Attributes:
        id: Primary key
        title: Presentation title
        input_text: Original text input used to generate slides
        theme: Design theme (default for MVP)
        api_key_id: Foreign key to API key (if created via public API)
        slides: Related slides in this presentation
        api_key: API key used to create this presentation (if any)
    """

    __tablename__ = "presentations"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    input_text: Mapped[str] = mapped_column(Text, nullable=False)
    theme: Mapped[str] = mapped_column(String(50), default="default", nullable=False)
    api_key_id: Mapped[int | None] = mapped_column(ForeignKey("api_keys.id"), nullable=True)

    # Relationships
    slides: Mapped[list["Slide"]] = relationship(
        "Slide",
        back_populates="presentation",
        cascade="all, delete-orphan",
        order_by="Slide.order",
    )
    api_key: Mapped["APIKey | None"] = relationship(
        "APIKey",
        back_populates="presentations",
    )

    def __repr__(self) -> str:
        return f"<Presentation(id={self.id}, title='{self.title}')>"
