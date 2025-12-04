"""
API Key Service - handles API key creation, validation, and management
"""

import hashlib
import secrets
from datetime import datetime, timezone

from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from packages.common.models.api_key import APIKey
from packages.common.schemas.api_key_schema import (
    APIKeyCreate,
    APIKeyCreateResponse,
    APIKeyResponse,
    APIKeyUpdate,
    APIKeyValidation,
)


class APIKeyService:
    """Service for managing API keys"""

    # Key format: dk_live_<32 random chars> or dk_test_<32 random chars>
    KEY_PREFIX_LIVE = "dk_live_"
    KEY_PREFIX_TEST = "dk_test_"

    @staticmethod
    def generate_key(is_test: bool = False) -> str:
        """Generate a new API key"""
        prefix = APIKeyService.KEY_PREFIX_TEST if is_test else APIKeyService.KEY_PREFIX_LIVE
        random_part = secrets.token_urlsafe(32)
        return f"{prefix}{random_part}"

    @staticmethod
    def hash_key(key: str) -> str:
        """Hash an API key for storage"""
        return hashlib.sha256(key.encode()).hexdigest()

    @staticmethod
    def get_key_prefix(key: str) -> str:
        """Extract the prefix portion of a key for identification"""
        # Return first 12 characters (e.g., "dk_live_xxxx")
        return key[:12] + "..."

    async def create_key(
        self,
        db: AsyncSession,
        data: APIKeyCreate,
        is_test: bool = False,
    ) -> APIKeyCreateResponse:
        """
        Create a new API key.
        Returns the full key only once - it cannot be retrieved later.
        """
        # Generate the key
        raw_key = self.generate_key(is_test=is_test)
        key_hash = self.hash_key(raw_key)
        key_prefix = self.get_key_prefix(raw_key)

        # Create the database record
        api_key = APIKey(
            name=data.name,
            key_hash=key_hash,
            key_prefix=key_prefix,
            scopes=data.scopes,
            expires_at=data.expires_at,
            is_active=True,
        )

        db.add(api_key)
        await db.commit()
        await db.refresh(api_key)

        # Return with the raw key (only time it's available)
        return APIKeyCreateResponse(
            id=api_key.id,
            name=api_key.name,
            key_prefix=api_key.key_prefix,
            key=raw_key,
            scopes=api_key.scopes,
            is_active=api_key.is_active,
            last_used_at=api_key.last_used_at,
            expires_at=api_key.expires_at,
            created_at=api_key.created_at,
            updated_at=api_key.updated_at,
        )

    async def validate_key(
        self,
        db: AsyncSession,
        raw_key: str,
    ) -> APIKeyValidation | None:
        """
        Validate an API key and return its data if valid.
        Updates last_used_at timestamp.
        Returns None if key is invalid, inactive, or expired.
        """
        key_hash = self.hash_key(raw_key)

        # Find the key
        result = await db.execute(select(APIKey).where(APIKey.key_hash == key_hash))
        api_key = result.scalar_one_or_none()

        if not api_key:
            return None

        # Check if active
        if not api_key.is_active:
            return None

        # Check if expired
        if api_key.expires_at and api_key.expires_at < datetime.now(timezone.utc):
            return None

        # Update last_used_at
        await db.execute(
            update(APIKey)
            .where(APIKey.id == api_key.id)
            .values(last_used_at=datetime.now(timezone.utc))
        )
        await db.commit()

        # Parse scopes
        scopes = [s.strip() for s in api_key.scopes.split(",") if s.strip()]

        return APIKeyValidation(
            id=api_key.id,
            name=api_key.name,
            scopes=scopes,
            is_active=api_key.is_active,
        )

    async def get_key(self, db: AsyncSession, key_id: int) -> APIKeyResponse | None:
        """Get an API key by ID"""
        result = await db.execute(select(APIKey).where(APIKey.id == key_id))
        api_key = result.scalar_one_or_none()

        if not api_key:
            return None

        return APIKeyResponse.model_validate(api_key)

    async def list_keys(
        self,
        db: AsyncSession,
        skip: int = 0,
        limit: int = 100,
    ) -> tuple[list[APIKeyResponse], int]:
        """List all API keys with pagination"""
        # Get total count
        count_result = await db.execute(select(APIKey))
        total = len(count_result.scalars().all())

        # Get paginated results
        result = await db.execute(
            select(APIKey).order_by(APIKey.created_at.desc()).offset(skip).limit(limit)
        )
        keys = result.scalars().all()

        return [APIKeyResponse.model_validate(k) for k in keys], total

    async def update_key(
        self,
        db: AsyncSession,
        key_id: int,
        data: APIKeyUpdate,
    ) -> APIKeyResponse | None:
        """Update an API key"""
        result = await db.execute(select(APIKey).where(APIKey.id == key_id))
        api_key = result.scalar_one_or_none()

        if not api_key:
            return None

        # Update fields
        update_data = data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(api_key, field, value)

        await db.commit()
        await db.refresh(api_key)

        return APIKeyResponse.model_validate(api_key)

    async def revoke_key(self, db: AsyncSession, key_id: int) -> bool:
        """Revoke (deactivate) an API key"""
        result = await db.execute(select(APIKey).where(APIKey.id == key_id))
        api_key = result.scalar_one_or_none()

        if not api_key:
            return False

        api_key.is_active = False
        await db.commit()

        return True

    async def delete_key(self, db: AsyncSession, key_id: int) -> bool:
        """Permanently delete an API key"""
        result = await db.execute(select(APIKey).where(APIKey.id == key_id))
        api_key = result.scalar_one_or_none()

        if not api_key:
            return False

        await db.delete(api_key)
        await db.commit()

        return True


# Singleton instance
api_key_service = APIKeyService()
