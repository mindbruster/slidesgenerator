"""
Slide Generation Service
Transforms raw text into structured slide presentations using LLM
"""

import json

from sqlalchemy.ext.asyncio import AsyncSession

from packages.common.core.logging import get_logger
from packages.common.models import Presentation, Slide
from packages.common.providers.llm import OpenRouterProvider
from packages.common.schemas import PresentationResponse

logger = get_logger(__name__)


SYSTEM_PROMPT = """You are an expert presentation designer. Transform the given text into a structured slide presentation.

Create slides that are:
1. CONCISE - Maximum 6 bullet points per slide, each under 12 words
2. VISUAL - Clear hierarchy with titles and subtitles
3. IMPACTFUL - Lead with key insights, not filler
4. BALANCED - Mix of slide types for visual variety

Output ONLY valid JSON with this exact structure:
{
  "title": "Presentation Title",
  "slides": [
    {
      "type": "title",
      "title": "Main Title",
      "subtitle": "Optional Subtitle",
      "layout": "center"
    },
    {
      "type": "content",
      "title": "Slide Title",
      "body": "Main paragraph content here",
      "layout": "left"
    },
    {
      "type": "bullets",
      "title": "Key Points",
      "bullets": ["Point 1", "Point 2", "Point 3"],
      "layout": "left"
    },
    {
      "type": "quote",
      "quote": "A meaningful quote",
      "attribution": "Author Name",
      "layout": "center"
    },
    {
      "type": "section",
      "title": "Section Divider",
      "layout": "center"
    }
  ]
}

Slide types:
- "title": Opening slide with main title and optional subtitle
- "content": Text-heavy slide with title and body paragraph
- "bullets": List of key points (3-6 bullets max)
- "quote": Impactful quote with attribution
- "section": Section divider for topic transitions

Layout options: "left", "center", "right"

RULES:
1. First slide MUST be type "title"
2. Use "section" slides to divide major topics
3. Alternate between slide types for variety
4. Keep bullets short and punchy
5. Extract meaningful quotes from the source material when possible
6. Target exactly {slide_count} slides"""


class SlideGeneratorService:
    """
    Service for generating slide presentations from text.

    Uses LLM to analyze and structure content into slides,
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
        Generate a presentation from input text.

        Args:
            text: Raw text to transform into slides
            slide_count: Target number of slides (5-15)
            title: Optional presentation title (auto-generated if not provided)

        Returns:
            PresentationResponse with generated slides
        """
        logger.info(f"Generating presentation with {slide_count} slides")

        # Call LLM to structure content
        prompt = f"Transform this text into {slide_count} slides:\n\n{text}"

        response = await self.llm.complete(
            messages=[
                {
                    "role": "system",
                    "content": SYSTEM_PROMPT.format(slide_count=slide_count),
                },
                {"role": "user", "content": prompt},
            ],
            response_format={"type": "json_object"},
            temperature=0.7,
        )

        # Parse LLM response
        try:
            content = json.loads(response["completion"])
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse LLM response: {e}")
            raise ValueError("Failed to generate valid slide structure") from e

        # Create presentation
        presentation = Presentation(
            title=title or content.get("title", "Untitled Presentation"),
            input_text=text,
            theme="default",
        )
        self.db.add(presentation)
        await self.db.flush()  # Get presentation.id

        # Create slides
        slides_data = content.get("slides", [])
        for i, slide_data in enumerate(slides_data):
            slide = Slide(
                presentation_id=presentation.id,
                type=slide_data.get("type", "content"),
                title=slide_data.get("title"),
                subtitle=slide_data.get("subtitle"),
                body=slide_data.get("body"),
                bullets=slide_data.get("bullets"),
                quote=slide_data.get("quote"),
                attribution=slide_data.get("attribution"),
                layout=slide_data.get("layout", "center"),
                order=i,
            )
            self.db.add(slide)

        await self.db.commit()
        await self.db.refresh(presentation)

        logger.info(f"Created presentation {presentation.id} with {len(slides_data)} slides")

        return PresentationResponse.model_validate(presentation)
