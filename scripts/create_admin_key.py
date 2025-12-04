"""
Script to create the initial admin API key.
Run this after migrations to get your first API key.

Usage:
    poetry run python scripts/create_admin_key.py
"""

import asyncio

from packages.common.core.database import async_session_factory
from packages.common.schemas.api_key_schema import APIKeyCreate
from packages.common.services.api_key_service import api_key_service


async def main():
    print("\n🔑 Creating Admin API Key for Decksnap Public API\n")
    print("=" * 50)

    async with async_session_factory() as db:
        # Create admin key with all permissions
        data = APIKeyCreate(
            name="Admin Key",
            scopes="*,admin:keys",  # Full access + key management
        )

        result = await api_key_service.create_key(db, data, is_test=False)

        print(f"\n✅ API Key created successfully!\n")
        print(f"   Name:   {result.name}")
        print(f"   ID:     {result.id}")
        print(f"   Scopes: {result.scopes}")
        print(f"\n{'=' * 50}")
        print(f"\n🔐 YOUR API KEY (save this - it won't be shown again!):\n")
        print(f"   {result.key}")
        print(f"\n{'=' * 50}")
        print(f"\n📝 Usage example:\n")
        print(f'   curl -X POST http://localhost:19000/api/v1/slides/generate \\')
        print(f'     -H "X-API-Key: {result.key}" \\')
        print(f'     -H "Content-Type: application/json" \\')
        print(f'     -d \'{{"text": "Your content here...", "slide_count": 5}}\'')
        print()


if __name__ == "__main__":
    asyncio.run(main())
