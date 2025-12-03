"""
OpenRouter LLM Provider
Provides access to multiple LLM models through OpenRouter API
"""

import httpx
from tenacity import retry, stop_after_attempt, wait_exponential

from packages.common.core.config import settings
from packages.common.core.logging import get_logger

logger = get_logger(__name__)


class OpenRouterProvider:
    """
    OpenRouter API client for LLM completions.

    OpenRouter provides unified access to multiple LLM providers
    including Claude, GPT-4, Llama, etc.
    """

    def __init__(
        self,
        api_key: str | None = None,
        model: str | None = None,
        base_url: str | None = None,
    ):
        self.api_key = api_key or settings.openrouter_api_key
        self.model = model or settings.openrouter_model
        self.base_url = base_url or settings.openrouter_base_url

        if not self.api_key:
            logger.warning("OpenRouter API key not configured")

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=10),
    )
    async def complete(
        self,
        messages: list[dict[str, str]],
        response_format: dict | None = None,
        temperature: float = 0.7,
        max_tokens: int = 4096,
    ) -> dict:
        """
        Generate a completion from the LLM.

        Args:
            messages: List of message dicts with 'role' and 'content'
            response_format: Optional format spec (e.g., {"type": "json_object"})
            temperature: Sampling temperature (0-2)
            max_tokens: Maximum tokens in response

        Returns:
            Dict with 'completion' (str) and 'usage' (dict)
        """
        if not self.api_key:
            raise ValueError("OpenRouter API key not configured")

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://decksnap.app",
            "X-Title": "Decksnap",
        }

        payload: dict = {
            "model": self.model,
            "messages": messages,
            "temperature": temperature,
            "max_tokens": max_tokens,
        }

        if response_format:
            payload["response_format"] = response_format

        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/chat/completions",
                headers=headers,
                json=payload,
                timeout=60.0,
            )
            response.raise_for_status()
            data = response.json()

        completion = data["choices"][0]["message"]["content"]
        usage = data.get("usage", {})

        logger.debug(
            f"OpenRouter completion: model={self.model}, "
            f"tokens={usage.get('total_tokens', 'N/A')}"
        )

        return {
            "completion": completion,
            "usage": usage,
            "model": self.model,
        }
