"""Test script to diagnose template API issues"""
import asyncio
from packages.common.core.database import async_session_factory
from packages.common.services.template_service import TemplateService


async def test_templates():
    """Test fetching templates"""
    try:
        async with async_session_factory() as db:
            service = TemplateService(db)
            print("Fetching templates...")
            templates = await service.list()
            print(f"Found {len(templates)} templates")

            if templates:
                print("\nConverting first template to list response...")
                first_template = templates[0]
                print(f"Template: {first_template.name}")
                print(f"  Category: {first_template.category}")
                print(f"  Theme: {first_template.theme}")
                print(f"  Difficulty: {first_template.difficulty_level}")
                print(f"  Estimated time: {first_template.estimated_time}")
                print(f"  Slides: {len(first_template.slides) if first_template.slides else 0}")

                response = service.to_list_response(first_template)
                print(f"\nSuccess! Response: {response.model_dump()}")
            else:
                print("No templates found in database!")

    except Exception as e:
        print(f"\nERROR: {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    asyncio.run(test_templates())
