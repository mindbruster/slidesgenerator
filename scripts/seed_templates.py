"""
Script to seed system templates into the database
"""

import asyncio
import sys
from pathlib import Path

# Add project root to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from packages.common.core.database import AsyncSessionLocal
from packages.common.templates.seed_data import seed_templates


async def main():
    print("Seeding system templates...")

    async with AsyncSessionLocal() as db:
        try:
            count = await seed_templates(db)
            print(f"Successfully created {count} system templates")
        except Exception as e:
            print(f"Error seeding templates: {e}")
            raise


if __name__ == "__main__":
    asyncio.run(main())
