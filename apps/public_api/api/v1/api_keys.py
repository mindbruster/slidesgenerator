"""
Public API - API Key management endpoints

Note: These endpoints require a master/admin API key with 'admin:keys' scope
to create and manage other API keys.
"""

from fastapi import APIRouter, Depends, HTTPException

from packages.common.core.database import AsyncSessionDep
from packages.common.schemas.api_key_schema import (
    APIKeyCreate,
    APIKeyCreateResponse,
    APIKeyListResponse,
    APIKeyResponse,
    APIKeyUpdate,
)
from packages.common.services.api_key_service import api_key_service

from apps.public_api.dependencies import require_scope

router = APIRouter()

# Require admin scope for key management
RequireAdminKeys = Depends(require_scope("admin:keys"))


@router.post("", response_model=APIKeyCreateResponse, dependencies=[RequireAdminKeys])
async def create_api_key(
    data: APIKeyCreate,
    db: AsyncSessionDep,
) -> APIKeyCreateResponse:
    """
    Create a new API key.

    **Important**: The full key is only returned once at creation.
    Store it securely - it cannot be retrieved later.

    Requires 'admin:keys' scope.
    """
    return await api_key_service.create_key(db, data)


@router.get("", response_model=APIKeyListResponse, dependencies=[RequireAdminKeys])
async def list_api_keys(
    db: AsyncSessionDep,
    skip: int = 0,
    limit: int = 100,
) -> APIKeyListResponse:
    """
    List all API keys.

    Returns key metadata only (not the actual keys).
    Requires 'admin:keys' scope.
    """
    keys, total = await api_key_service.list_keys(db, skip=skip, limit=limit)
    return APIKeyListResponse(keys=keys, total=total)


@router.get("/{key_id}", response_model=APIKeyResponse, dependencies=[RequireAdminKeys])
async def get_api_key(
    key_id: int,
    db: AsyncSessionDep,
) -> APIKeyResponse:
    """
    Get an API key by ID.

    Returns key metadata only (not the actual key).
    Requires 'admin:keys' scope.
    """
    key = await api_key_service.get_key(db, key_id)
    if not key:
        raise HTTPException(status_code=404, detail="API key not found")
    return key


@router.patch("/{key_id}", response_model=APIKeyResponse, dependencies=[RequireAdminKeys])
async def update_api_key(
    key_id: int,
    data: APIKeyUpdate,
    db: AsyncSessionDep,
) -> APIKeyResponse:
    """
    Update an API key's metadata.

    Can update name, is_active, and scopes.
    Requires 'admin:keys' scope.
    """
    key = await api_key_service.update_key(db, key_id, data)
    if not key:
        raise HTTPException(status_code=404, detail="API key not found")
    return key


@router.post("/{key_id}/revoke", response_model=APIKeyResponse, dependencies=[RequireAdminKeys])
async def revoke_api_key(
    key_id: int,
    db: AsyncSessionDep,
) -> APIKeyResponse:
    """
    Revoke (deactivate) an API key.

    The key will no longer be valid for authentication.
    Requires 'admin:keys' scope.
    """
    success = await api_key_service.revoke_key(db, key_id)
    if not success:
        raise HTTPException(status_code=404, detail="API key not found")

    key = await api_key_service.get_key(db, key_id)
    return key  # type: ignore


@router.delete("/{key_id}", dependencies=[RequireAdminKeys])
async def delete_api_key(
    key_id: int,
    db: AsyncSessionDep,
) -> dict[str, str]:
    """
    Permanently delete an API key.

    This also deletes all presentations created with this key.
    Requires 'admin:keys' scope.
    """
    success = await api_key_service.delete_key(db, key_id)
    if not success:
        raise HTTPException(status_code=404, detail="API key not found")

    return {"status": "deleted", "id": str(key_id)}
