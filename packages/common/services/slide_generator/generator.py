"""
Slide Generation Service
Transforms raw text into structured slide presentations using LLM with tool calling
"""

import json
from dataclasses import dataclass
from typing import Any, AsyncGenerator, Literal

from openai.types.chat import ChatCompletionMessageToolCall
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from packages.common.core.logging import get_logger
from packages.common.models import Presentation, Slide
from packages.common.providers.llm import OpenRouterProvider
from packages.common.schemas import PresentationResponse

from .tools import SLIDE_TOOLS, SYSTEM_PROMPT

logger = get_logger(__name__)

MAX_ITERATIONS = 25  # Safety limit for agentic loop


@dataclass
class AgentEvent:
    """Event emitted during slide generation for real-time UI updates."""

    type: Literal["thinking", "tool_call", "tool_result", "complete", "error"]
    data: dict[str, Any]

    def to_sse(self) -> str:
        """Format as Server-Sent Event."""
        return f"data: {json.dumps({'type': self.type, **self.data})}\n\n"


class SlideGeneratorService:
    """
    Service for generating slide presentations from text.

    Uses LLM tool calling to create slides incrementally,
    then persists to database.
    """

    def __init__(self, db: AsyncSession):
        self.db = db
        self.llm = OpenRouterProvider()

    async def generate(
        self,
        text: str,
        slide_count: int = 8,
        title: str | None = None,
    ) -> PresentationResponse:
        """
        Generate a presentation from input text using tool calling.

        Args:
            text: Raw text to transform into slides
            slide_count: Target number of slides (5-15)
            title: Optional presentation title (auto-generated if not provided)

        Returns:
            PresentationResponse with generated slides
        """
        logger.info(f"Generating presentation with {slide_count} slides using tool calling")

        # Create presentation shell
        presentation = Presentation(
            title=title or "Untitled Presentation",
            input_text=text,
            theme="default",
        )
        self.db.add(presentation)
        await self.db.flush()  # Get presentation.id

        # Build initial messages
        messages: list[dict[str, Any]] = [
            {
                "role": "system",
                "content": SYSTEM_PROMPT.format(slide_count=slide_count),
            },
            {"role": "user", "content": text},
        ]

        slide_order = 0

        # Agentic loop
        for iteration in range(MAX_ITERATIONS):
            logger.debug(f"Tool calling iteration {iteration + 1}")

            response = await self.llm.complete_with_tools(
                messages=messages,
                tools=SLIDE_TOOLS,
                temperature=0.7,
            )

            assistant_message = response.choices[0].message
            tool_calls = assistant_message.tool_calls

            # No tool calls means LLM is done (or confused)
            if not tool_calls:
                logger.debug("No tool calls, ending loop")
                break

            # Add assistant message with tool calls to context
            messages.append(
                {
                    "role": "assistant",
                    "content": assistant_message.content or "",
                    "tool_calls": [
                        {
                            "id": tc.id,
                            "type": "function",
                            "function": {
                                "name": tc.function.name,
                                "arguments": tc.function.arguments,
                            },
                        }
                        for tc in tool_calls
                    ],
                }
            )

            # Process each tool call
            for tool_call in tool_calls:
                result, finished = await self._handle_tool_call(
                    tool_call, presentation, slide_order
                )

                # Add tool result to messages
                messages.append(
                    {
                        "role": "tool",
                        "tool_call_id": tool_call.id,
                        "content": result,
                    }
                )

                if tool_call.function.name == "add_slide":
                    slide_order += 1

                if finished:
                    await self.db.commit()
                    logger.info(
                        f"Created presentation {presentation.id} with {slide_order} slides"
                    )
                    return await self._load_presentation(presentation.id)

        # Loop ended without finish_presentation - commit what we have
        await self.db.commit()
        logger.warning(
            f"Loop ended without finish_presentation. "
            f"Created presentation {presentation.id} with {slide_order} slides"
        )
        return await self._load_presentation(presentation.id)

    async def generate_stream(
        self,
        text: str,
        slide_count: int = 8,
        title: str | None = None,
    ) -> AsyncGenerator[AgentEvent, None]:
        """
        Generate a presentation with real-time event streaming.

        Yields AgentEvent objects for UI updates as the agent works.
        """
        logger.info(f"Streaming generation with {slide_count} slides")

        # Emit start event
        yield AgentEvent(
            type="thinking",
            data={"message": "Analyzing your content..."},
        )

        # Create presentation shell
        presentation = Presentation(
            title=title or "Untitled Presentation",
            input_text=text,
            theme="default",
        )
        self.db.add(presentation)
        await self.db.flush()

        # Build initial messages
        messages: list[dict[str, Any]] = [
            {
                "role": "system",
                "content": SYSTEM_PROMPT.format(slide_count=slide_count),
            },
            {"role": "user", "content": text},
        ]

        slide_order = 0
        presentation_id = presentation.id

        # Agentic loop
        for iteration in range(MAX_ITERATIONS):
            yield AgentEvent(
                type="thinking",
                data={"message": f"Planning slide {slide_order + 1}...", "iteration": iteration + 1},
            )

            response = await self.llm.complete_with_tools(
                messages=messages,
                tools=SLIDE_TOOLS,
                temperature=0.7,
            )

            assistant_message = response.choices[0].message
            tool_calls = assistant_message.tool_calls

            if not tool_calls:
                break

            # Add assistant message to context
            messages.append(
                {
                    "role": "assistant",
                    "content": assistant_message.content or "",
                    "tool_calls": [
                        {
                            "id": tc.id,
                            "type": "function",
                            "function": {
                                "name": tc.function.name,
                                "arguments": tc.function.arguments,
                            },
                        }
                        for tc in tool_calls
                    ],
                }
            )

            # Process tool calls
            for tool_call in tool_calls:
                name = tool_call.function.name
                try:
                    args = json.loads(tool_call.function.arguments)
                except json.JSONDecodeError:
                    continue

                # Emit tool call event
                yield AgentEvent(
                    type="tool_call",
                    data={
                        "tool": name,
                        "args": args,
                        "slide_number": slide_order + 1 if name == "add_slide" else None,
                    },
                )

                # Execute tool
                result, finished = await self._handle_tool_call(
                    tool_call, presentation, slide_order
                )

                # Emit tool result
                yield AgentEvent(
                    type="tool_result",
                    data={
                        "tool": name,
                        "result": result,
                        "success": True,
                    },
                )

                messages.append(
                    {
                        "role": "tool",
                        "tool_call_id": tool_call.id,
                        "content": result,
                    }
                )

                if name == "add_slide":
                    slide_order += 1

                if finished:
                    await self.db.commit()
                    final = await self._load_presentation(presentation_id)
                    yield AgentEvent(
                        type="complete",
                        data={
                            "presentation_id": presentation_id,
                            "title": final.title,
                            "slide_count": len(final.slides),
                            "presentation": final.model_dump(mode="json"),
                        },
                    )
                    return

        # Loop ended
        await self.db.commit()
        final = await self._load_presentation(presentation_id)
        yield AgentEvent(
            type="complete",
            data={
                "presentation_id": presentation_id,
                "title": final.title,
                "slide_count": len(final.slides),
                "presentation": final.model_dump(mode="json"),
            },
        )

    async def _load_presentation(self, presentation_id: int) -> PresentationResponse:
        """Load a presentation with all relationships for serialization."""
        stmt = (
            select(Presentation)
            .where(Presentation.id == presentation_id)
            .options(selectinload(Presentation.slides))
        )
        result = await self.db.execute(stmt)
        presentation = result.scalar_one()
        return PresentationResponse.model_validate(presentation)

    async def _handle_tool_call(
        self,
        tool_call: ChatCompletionMessageToolCall,
        presentation: Presentation,
        slide_order: int,
    ) -> tuple[str, bool]:
        """
        Handle a single tool call.

        Returns:
            Tuple of (result_message, is_finished)
        """
        name = tool_call.function.name
        try:
            args = json.loads(tool_call.function.arguments)
        except json.JSONDecodeError as e:
            logger.error(f"Invalid tool arguments: {e}")
            return f"Error: Invalid arguments - {e}", False

        if name == "add_slide":
            return await self._add_slide(args, presentation, slide_order)
        elif name == "finish_presentation":
            return await self._finish_presentation(args, presentation)
        else:
            return f"Error: Unknown tool '{name}'", False

    async def _add_slide(
        self,
        args: dict[str, Any],
        presentation: Presentation,
        order: int,
    ) -> tuple[str, bool]:
        """Add a slide to the presentation."""
        slide = Slide(
            presentation_id=presentation.id,
            type=args.get("slide_type", "content"),
            title=args.get("title"),
            subtitle=args.get("subtitle"),
            body=args.get("body"),
            bullets=args.get("bullets"),
            quote=args.get("quote"),
            attribution=args.get("attribution"),
            layout=args.get("layout", "center"),
            order=order,
        )
        self.db.add(slide)
        await self.db.flush()

        logger.debug(f"Added slide {order + 1}: {slide.type} - {slide.title}")
        return f"Added slide {order + 1}: {slide.type} slide titled '{slide.title}'", False

    async def _finish_presentation(
        self,
        args: dict[str, Any],
        presentation: Presentation,
    ) -> tuple[str, bool]:
        """Finalize the presentation with title."""
        title = args.get("title", "Untitled Presentation")
        presentation.title = title

        logger.debug(f"Finishing presentation with title: {title}")
        return f"Presentation '{title}' completed successfully.", True
