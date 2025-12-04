"""
Test script to debug streaming generation
Run with: poetry run python test_streaming.py
"""

import asyncio
import httpx


async def test_stream():
    """Test the streaming endpoint directly."""
    url = "http://localhost:18000/api/v1/slides/generate/stream"

    payload = {
        "text": "Benefits of using Python for data science.",
        "slide_count": 3,
        "theme": "neobrutalism"
    }

    print("Sending request to:", url)
    print("Payload:", payload)
    print("-" * 50)

    timeout = httpx.Timeout(connect=10.0, read=120.0, write=10.0, pool=120.0)

    async with httpx.AsyncClient(timeout=timeout) as client:
        async with client.stream("POST", url, json=payload) as response:
            print(f"Response status: {response.status_code}")
            print(f"Response headers: {dict(response.headers)}")
            print("-" * 50)

            async for line in response.aiter_lines():
                print(f"Event: {line}")


async def test_health():
    """Test the health endpoint first."""
    url = "http://localhost:18000/health"
    print("Testing health endpoint...")

    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        print(f"Health check: {response.status_code} - {response.json()}")
        print("-" * 50)


if __name__ == "__main__":
    print("=" * 50)
    print("STREAMING GENERATION TEST")
    print("=" * 50)

    asyncio.run(test_health())
    asyncio.run(test_stream())
