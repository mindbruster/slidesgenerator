"""
Template models - reusable presentation templates
"""

from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy import Boolean, ForeignKey, Integer, String, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship

from packages.common.models.base import Base, TimestampMixin

if TYPE_CHECKING:
    from packages.common.models.template import TemplateSlide


class Template(Base, TimestampMixin):
    """
    Template model for reusable presentation structures.

    Attributes:
        id: Primary key
        name: Template display name
        description: Brief description of template purpose
        category: Template category (business, education, etc.)
        theme: Default theme for this template
        thumbnail_url: Preview image URL
        is_system: True for built-in templates, False for user-created
        is_public: Whether template is visible to all users
        usage_count: Number of times template has been used
        tags: Searchable tags as JSON array
        difficulty_level: beginner, intermediate, or advanced
        estimated_time: Estimated completion time in minutes
        industry_tags: Industry-specific tags for filtering
        popularity_score: Calculated score for sorting
    """

    __tablename__ = "templates"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    category: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    theme: Mapped[str] = mapped_column(String(50), default="neobrutalism", nullable=False)
    thumbnail_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    is_system: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    is_public: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    usage_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    tags: Mapped[list[str] | None] = mapped_column(JSON(none_as_null=True), nullable=True)

    # Metadata fields for improved discoverability
    difficulty_level: Mapped[str] = mapped_column(
        String(20), default="beginner", nullable=False
    )
    estimated_time: Mapped[int] = mapped_column(Integer, default=10, nullable=False)
    industry_tags: Mapped[list[str] | None] = mapped_column(
        JSON(none_as_null=True), nullable=True
    )
    popularity_score: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    # Relationships
    slides: Mapped[list["TemplateSlide"]] = relationship(
        "TemplateSlide",
        back_populates="template",
        cascade="all, delete-orphan",
        order_by="TemplateSlide.order",
    )

    def __repr__(self) -> str:
        return f"<Template(id={self.id}, name='{self.name}', category='{self.category}')>"


class TemplateSlide(Base):
    """
    Template slide - defines structure for a single slide in a template.

    Attributes:
        id: Primary key
        template_id: Foreign key to parent template
        order: Slide position (1-based)
        slide_type: Type of slide (title, content, bullets, etc.)
        layout: Slide layout (left, center, right, split)
        placeholder_title: Default/example title text
        placeholder_body: Default/example body text
        placeholder_bullets: Default/example bullet points
        ai_instructions: Guidance for AI when generating this slide
        is_required: Whether this slide must be included
    """

    __tablename__ = "template_slides"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    template_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("templates.id", ondelete="CASCADE"),
        nullable=False,
    )
    order: Mapped[int] = mapped_column(Integer, nullable=False)
    slide_type: Mapped[str] = mapped_column(String(50), nullable=False)
    layout: Mapped[str] = mapped_column(String(20), default="center", nullable=False)
    placeholder_title: Mapped[str | None] = mapped_column(String(255), nullable=True)
    placeholder_body: Mapped[str | None] = mapped_column(Text, nullable=True)
    placeholder_bullets: Mapped[list[str] | None] = mapped_column(
        JSON(none_as_null=True), nullable=True
    )
    ai_instructions: Mapped[str | None] = mapped_column(Text, nullable=True)
    is_required: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    # Relationships
    template: Mapped["Template"] = relationship(
        "Template",
        back_populates="slides",
    )

    def __repr__(self) -> str:
        return f"<TemplateSlide(id={self.id}, order={self.order}, type='{self.slide_type}')>"
