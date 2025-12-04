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
from packages.common.providers.unsplash import unsplash_provider
from packages.common.schemas import PresentationResponse
from packages.common.themes import Theme, get_theme

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
        self.current_theme: Theme | None = None

    async def generate(
        self,
        text: str,
        slide_count: int = 8,
        title: str | None = None,
        theme: str = "neobrutalism",
        api_key_id: int | None = None,
        template_prompt: str | None = None,
    ) -> PresentationResponse:
        """
        Generate a presentation from input text using tool calling.

        Args:
            text: Raw text to transform into slides
            slide_count: Target number of slides (5-15)
            title: Optional presentation title (auto-generated if not provided)
            theme: Presentation theme name
            api_key_id: Optional API key ID (for public API tracking)
            template_prompt: Optional template structure guidance for AI

        Returns:
            PresentationResponse with generated slides
        """
        logger.info(f"Generating presentation with {slide_count} slides using tool calling")

        # Set current theme for tool calls
        self.current_theme = get_theme(theme)

        # Create presentation shell
        presentation = Presentation(
            title=title or "Untitled Presentation",
            input_text=text,
            theme=theme,
            api_key_id=api_key_id,
        )
        self.db.add(presentation)
        await self.db.flush()  # Get presentation.id

        # Build system prompt with theme-specific instructions
        system_content = SYSTEM_PROMPT.format(slide_count=slide_count)
        system_content += f"\n\nCURRENT THEME INFO:\n{self._get_current_theme()}"

        # Build initial messages
        system_content = SYSTEM_PROMPT.format(slide_count=slide_count)
        if template_prompt:
            system_content += f"\n\n{template_prompt}"

        messages: list[dict[str, Any]] = [
            {
                "role": "system",
                "content": system_content,
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
        theme: str = "neobrutalism",
        template_prompt: str | None = None,
    ) -> AsyncGenerator[AgentEvent, None]:
        """
        Generate a presentation with real-time event streaming.

        Yields AgentEvent objects for UI updates as the agent works.
        """
        logger.info(f"=== STREAM START === slide_count={slide_count}, theme={theme}")
        logger.info(f"Text length: {len(text)} chars")
        if template_prompt:
            logger.info(f"Template prompt length: {len(template_prompt)} chars")

        # Set current theme for tool calls
        self.current_theme = get_theme(theme)
        logger.info(f"Theme set: {self.current_theme.name if self.current_theme else 'None'}")

        # Emit start event
        logger.info("Yielding first thinking event...")
        yield AgentEvent(
            type="thinking",
            data={"message": "Analyzing your content..."},
        )
        logger.info("First event yielded successfully")

        # Create presentation shell
        logger.info("Creating presentation shell...")
        presentation = Presentation(
            title=title or "Untitled Presentation",
            input_text=text,
            theme=theme,
        )
        self.db.add(presentation)
        logger.info("Flushing to database...")
        await self.db.flush()
        logger.info(f"Presentation created with ID: {presentation.id}")

        # Build system prompt with theme-specific instructions
        system_content = SYSTEM_PROMPT.format(slide_count=slide_count)
        system_content += f"\n\nCURRENT THEME INFO:\n{self._get_current_theme()}"

        # Build initial messages
        logger.info("Building initial messages...")
        system_content = SYSTEM_PROMPT.format(slide_count=slide_count)
        if template_prompt:
            system_content += f"\n\n{template_prompt}"
        logger.info(f"System prompt length: {len(system_content)} chars")

        messages: list[dict[str, Any]] = [
            {
                "role": "system",
                "content": system_content,
            },
            {"role": "user", "content": text},
        ]

        slide_order = 0
        presentation_id = presentation.id
        logger.info(f"Starting agentic loop. Presentation ID: {presentation_id}")

        # Agentic loop
        for iteration in range(MAX_ITERATIONS):
            logger.info(f"=== ITERATION {iteration + 1} START ===")
            yield AgentEvent(
                type="thinking",
                data={"message": f"Planning slide {slide_order + 1}...", "iteration": iteration + 1},
            )
            logger.info(f"Iteration {iteration + 1}: Thinking event yielded")

            try:
                logger.info(f"Iteration {iteration + 1}: Calling LLM API...")
                logger.info(f"Model: {self.llm.model}, Messages count: {len(messages)}")
                response = await self.llm.complete_with_tools(
                    messages=messages,
                    tools=SLIDE_TOOLS,
                    temperature=0.7,
                )
                logger.info(f"Iteration {iteration + 1}: LLM API call completed successfully")
            except Exception as e:
                logger.error(f"LLM API call failed (iteration {iteration + 1}): {e}", exc_info=True)
                yield AgentEvent(
                    type="error",
                    data={"message": f"Failed to generate slide: {str(e)}", "iteration": iteration + 1},
                )
                raise

            assistant_message = response.choices[0].message
            tool_calls = assistant_message.tool_calls

            if not tool_calls:
                break

            # Emit thinking event with LLM's reasoning
            if assistant_message.content:
                yield AgentEvent(
                    type="thinking",
                    data={
                        "message": assistant_message.content,
                        "iteration": iteration + 1,
                    },
                )

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

                # Emit tool call event with full slide data for preview
                event_data: dict[str, Any] = {
                    "tool": name,
                    "args": args,
                    "slide_number": slide_order + 1 if name == "add_slide" else None,
                }

                # Include slide preview data
                if name == "add_slide":
                    event_data["slide"] = {
                        "type": args.get("slide_type", "content"),
                        "title": args.get("title"),
                        "subtitle": args.get("subtitle"),
                        "body": args.get("body"),
                        "bullets": args.get("bullets"),
                        "quote": args.get("quote"),
                        "attribution": args.get("attribution"),
                        "layout": args.get("layout", "center"),
                        "order": slide_order,
                        "chart_type": args.get("chart_type"),
                        "chart_data": args.get("chart_data"),
                        "chart_config": args.get("chart_config"),
                        "image_query": args.get("image_query"),
                    }

                yield AgentEvent(type="tool_call", data=event_data)

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

        if name == "get_current_theme":
            return self._get_current_theme(), False
        elif name == "add_slide":
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
        # Fetch image from Unsplash if image_query is provided
        image_url = None
        image_alt = None
        image_credit = None

        image_query = args.get("image_query")
        if image_query:
            try:
                image_data = await unsplash_provider.search_image(image_query)
                if image_data:
                    image_url = image_data["url"]
                    image_alt = image_data["alt"]
                    image_credit = f"Photo by {image_data['photographer']} on Unsplash"
                    logger.debug(f"Fetched image for query '{image_query}': {image_url[:50]}...")
            except Exception as e:
                logger.warning(f"Failed to fetch image for query '{image_query}': {e}")

        # Helper to ensure JSON fields get None instead of empty/null values
        # Also handles cases where LLM passes the literal string "null"
        def get_json_field(key: str) -> Any:
            val = args.get(key)
            if val is None or val == "null" or val == "" or val == []:
                return None
            return val

        slide = Slide(
            presentation_id=presentation.id,
            type=args.get("slide_type", "content"),
            title=args.get("title"),
            subtitle=args.get("subtitle"),
            body=args.get("body"),
            bullets=get_json_field("bullets"),
            quote=args.get("quote"),
            attribution=args.get("attribution"),
            layout=args.get("layout", "center"),
            order=order,
            chart_type=args.get("chart_type"),
            chart_data=get_json_field("chart_data"),
            chart_config=get_json_field("chart_config"),
            image_url=image_url,
            image_alt=image_alt,
            image_credit=image_credit,
            # New slide type fields
            stats=get_json_field("stats"),
            big_number_value=args.get("big_number_value"),
            big_number_label=args.get("big_number_label"),
            big_number_context=args.get("big_number_context"),
            comparison_columns=get_json_field("comparison_columns"),
            timeline_items=get_json_field("timeline_items"),
        )
        self.db.add(slide)
        await self.db.flush()

        logger.debug(f"Added slide {order + 1}: {slide.type} - {slide.title}")
        image_info = " (with image)" if image_url else ""
        return f"Added slide {order + 1}: {slide.type} slide titled '{slide.title}'{image_info}", False

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

    def _get_current_theme(self) -> str:
        """Return current theme info for LLM context."""
        if not self.current_theme:
            return "Theme: neobrutalism (default)"

        theme_info = (
            f"Theme: {self.current_theme.display_name}\n"
            f"Style: {self.current_theme.description}\n"
            f"Colors: background={self.current_theme.colors.background}, "
            f"accent={self.current_theme.colors.accent}, "
            f"text={self.current_theme.colors.text_primary}"
        )

        # Add special instructions for AI theme - it requires background images
        if self.current_theme.name.value == "ai":
            theme_info += (
                "\n\nIMPORTANT: This theme is designed for futuristic AI/robotics presentations. "
                "You MUST add image_query to EVERY slide for full-screen background images. "
                "Use queries like: 'artificial intelligence neural network', 'futuristic robot', "
                "'AI technology circuit board', 'machine learning visualization', "
                "'robotic arm automation', 'digital brain neural connections', "
                "'cyber technology abstract', 'autonomous AI system'."
            )

        return theme_info
