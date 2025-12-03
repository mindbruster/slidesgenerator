"""
OpenRouter LLM Provider
Provides access to multiple LLM models through OpenRouter API
"""

from typing import Any

import httpx
from openai import AsyncOpenAI
from openai.types.chat import ChatCompletion
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

        # OpenAI SDK client for tool calling
        self._openai_client: AsyncOpenAI | None = None

    @property
    def openai_client(self) -> AsyncOpenAI:
        """Lazy-initialized OpenAI client configured for OpenRouter."""
        if self._openai_client is None:
            self._openai_client = AsyncOpenAI(
                api_key=self.api_key,
                base_url=self.base_url,
                timeout=httpx.Timeout(connect=30.0, read=120.0, write=30.0, pool=120.0),
                max_retries=2,
                default_headers={
                    "HTTP-Referer": "https://decksnap.app",
                    "X-Title": "Decksnap",
                },
            )
        return self._openai_client

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

    async def complete_with_tools(
        self,
        messages: list[dict[str, Any]],
        tools: list[dict[str, Any]],
        temperature: float = 0.7,
        max_tokens: int = 4096,
    ) -> ChatCompletion:
        """
        Generate a completion with tool/function calling support.

        Uses the OpenAI SDK for proper tool call handling.

        Args:
            messages: List of message dicts (system, user, assistant, tool)
            tools: List of tool definitions in OpenAI format
            temperature: Sampling temperature (0-2)
            max_tokens: Maximum tokens in response

        Returns:
            ChatCompletion object with potential tool_calls
        """
        if not self.api_key:
            raise ValueError("OpenRouter API key not configured")

        response = await self.openai_client.chat.completions.create(
            model=self.model,
            messages=messages,  # type: ignore
            tools=tools,  # type: ignore
            tool_choice="auto",
            temperature=temperature,
            max_tokens=max_tokens,
        )

        usage = response.usage
        if usage:
            logger.debug(
                f"OpenRouter tool completion: model={self.model}, "
                f"tokens={usage.total_tokens}"
            )

        return response
