"""
Unsplash Provider - fetches stock images based on keywords
"""

import httpx
from packages.common.core.config import settings
from packages.common.core.logging import get_logger

logger = get_logger(__name__)


class UnsplashProvider:
    """Provider for fetching images from Unsplash API"""

    BASE_URL = "https://api.unsplash.com"

    @property
    def access_key(self) -> str | None:
        """Get access key from settings (checked each time to pick up env changes)"""
        key = settings.unsplash_access_key
        return key if key else None

    async def search_image(self, query: str, orientation: str = "landscape") -> dict | None:
        """
        Search for an image on Unsplash.

        Args:
            query: Search keywords
            orientation: Image orientation (landscape, portrait, squarish)

        Returns:
            Dict with image data or None if not found/no API key
        """
        if not self.access_key:
            logger.warning("Unsplash API key not configured, skipping image fetch")
            return None

        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.BASE_URL}/search/photos",
                    params={
                        "query": query,
                        "orientation": orientation,
                        "per_page": 1,
                    },
                    headers={
                        "Authorization": f"Client-ID {self.access_key}",
                    },
                    timeout=10.0,
                )
                response.raise_for_status()
                data = response.json()

                if data.get("results") and len(data["results"]) > 0:
                    photo = data["results"][0]
                    return {
                        "url": photo["urls"]["regular"],  # 1080px wide
                        "thumb_url": photo["urls"]["small"],  # 400px wide
                        "alt": photo.get("alt_description") or photo.get("description") or query,
                        "photographer": photo["user"]["name"],
                        "photographer_url": photo["user"]["links"]["html"],
                        "unsplash_url": photo["links"]["html"],
                    }
                return None

        except Exception as e:
            # Log error but don't fail slide generation
            logger.error(f"Unsplash API error for query '{query}': {e}")
            return None

    async def get_random_image(self, query: str, orientation: str = "landscape") -> dict | None:
        """
        Get a random image from Unsplash matching the query.

        Args:
            query: Search keywords
            orientation: Image orientation

        Returns:
            Dict with image data or None
        """
        if not self.access_key:
            return None

        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.BASE_URL}/photos/random",
                    params={
                        "query": query,
                        "orientation": orientation,
                    },
                    headers={
                        "Authorization": f"Client-ID {self.access_key}",
                    },
                    timeout=10.0,
                )
                response.raise_for_status()
                photo = response.json()

                return {
                    "url": photo["urls"]["regular"],
                    "thumb_url": photo["urls"]["small"],
                    "alt": photo.get("alt_description") or photo.get("description") or query,
                    "photographer": photo["user"]["name"],
                    "photographer_url": photo["user"]["links"]["html"],
                    "unsplash_url": photo["links"]["html"],
                }

        except Exception as e:
            logger.error(f"Unsplash API error for random image '{query}': {e}")
            return None


# Singleton instance
unsplash_provider = UnsplashProvider()
