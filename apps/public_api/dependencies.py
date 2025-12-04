"""
Public API Dependencies
Provides API key validation and other common dependencies
"""

from typing import Annotated

from fastapi import Depends, Header, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from packages.common.core.database import get_db
from packages.common.schemas.api_key_schema import APIKeyValidation
from packages.common.services.api_key_service import api_key_service


async def get_api_key(
    x_api_key: Annotated[str | None, Header()] = None,
    db: AsyncSession = Depends(get_db),
) -> APIKeyValidation:
    """
    Validate the API key from the X-API-Key header.
    Raises 401 if key is missing, invalid, or expired.
    """
    if not x_api_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing API key. Provide X-API-Key header.",
            headers={"WWW-Authenticate": "X-API-Key"},
        )

    api_key = await api_key_service.validate_key(db, x_api_key)

    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired API key.",
            headers={"WWW-Authenticate": "X-API-Key"},
        )

    return api_key


def require_scope(required_scope: str):
    """
    Dependency factory that checks if the API key has the required scope.
    Use '*' in API key scopes to allow all operations.
    """

    async def check_scope(
        api_key: APIKeyValidation = Depends(get_api_key),
    ) -> APIKeyValidation:
        # Wildcard scope allows everything
        if "*" in api_key.scopes:
            return api_key

        # Check for specific scope
        if required_scope not in api_key.scopes:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"API key lacks required scope: {required_scope}",
            )

        return api_key

    return check_scope


# Common dependency aliases
RequireAPIKey = Annotated[APIKeyValidation, Depends(get_api_key)]
RequireSlidesRead = Annotated[APIKeyValidation, Depends(require_scope("slides:read"))]
RequireSlidesWrite = Annotated[APIKeyValidation, Depends(require_scope("slides:write"))]
RequirePresentationsRead = Annotated[APIKeyValidation, Depends(require_scope("presentations:read"))]
RequirePresentationsWrite = Annotated[APIKeyValidation, Depends(require_scope("presentations:write"))]
RequireExport = Annotated[APIKeyValidation, Depends(require_scope("export"))]
