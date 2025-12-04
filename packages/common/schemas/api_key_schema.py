"""
API Key schemas for request/response validation
"""

from datetime import datetime

from pydantic import BaseModel, Field


class APIKeyBase(BaseModel):
    """Base API key schema"""

    name: str = Field(..., min_length=1, max_length=100, description="Human-readable name for the key")
    scopes: str = Field(default="*", description="Comma-separated scopes (e.g., 'slides:read,slides:write' or '*' for all)")


class APIKeyCreate(APIKeyBase):
    """Schema for creating an API key"""

    expires_at: datetime | None = Field(default=None, description="Optional expiration date")


class APIKeyUpdate(BaseModel):
    """Schema for updating an API key (all fields optional)"""

    name: str | None = Field(default=None, min_length=1, max_length=100)
    is_active: bool | None = None
    scopes: str | None = None


class APIKeyResponse(APIKeyBase):
    """Schema for API key response (does not include the actual key)"""

    id: int
    key_prefix: str = Field(..., description="First characters of the key for identification")
    is_active: bool
    last_used_at: datetime | None
    expires_at: datetime | None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class APIKeyCreateResponse(APIKeyResponse):
    """
    Response when creating a new API key.
    Includes the full key (only shown once at creation time).
    """

    key: str = Field(..., description="The full API key. Store this securely - it won't be shown again!")


class APIKeyListResponse(BaseModel):
    """Schema for listing API keys"""

    keys: list[APIKeyResponse]
    total: int


class APIKeyValidation(BaseModel):
    """Internal schema for validated API key data"""

    id: int
    name: str
    scopes: list[str]
    is_active: bool
