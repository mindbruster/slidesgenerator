"""
API Key model - represents an API key for public API access
"""

from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, DateTime, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from packages.common.models.base import Base, TimestampMixin

if TYPE_CHECKING:
    from packages.common.models.presentation import Presentation


class APIKey(Base, TimestampMixin):
    """
    API Key model for authenticating public API requests.

    Attributes:
        id: Primary key
        name: Human-readable name for the key (e.g., "Production", "Development")
        key_hash: Hashed API key (never store plain text)
        key_prefix: First 8 chars of key for identification (e.g., "dk_live_")
        is_active: Whether the key is currently active
        last_used_at: Timestamp of last API call with this key
        expires_at: Optional expiration date
        scopes: Comma-separated list of allowed scopes (e.g., "slides:read,slides:write")
        presentations: Presentations created with this API key
    """

    __tablename__ = "api_keys"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    key_hash: Mapped[str] = mapped_column(String(64), nullable=False, unique=True)
    key_prefix: Mapped[str] = mapped_column(String(20), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    last_used_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    expires_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    scopes: Mapped[str] = mapped_column(Text, default="*", nullable=False)

    # Relationships - presentations created via this API key
    presentations: Mapped[list["Presentation"]] = relationship(
        "Presentation",
        back_populates="api_key",
    )

    def __repr__(self) -> str:
        return f"<APIKey(id={self.id}, name='{self.name}', prefix='{self.key_prefix}')>"
