"""
Sales Content Generator Service
Transforms structured sales input into presentation-ready content
"""

from dataclasses import dataclass

from packages.common.core.logging import get_logger
from packages.common.providers.llm import OpenRouterProvider
from packages.common.schemas.sales_schema import SalesPitchInput

from .prompts import SALES_SYSTEM_PROMPT

logger = get_logger(__name__)


@dataclass
class GeneratedSalesContent:
    """Output from the sales content generator"""

    text: str
    title: str
    outline: list[str]


class SalesContentGenerator:
    """
    Generates sales-focused presentation content from structured input.

    This service takes structured sales data (product, market, pain points, etc.)
    and generates compelling sales pitch content that can be fed into the
    slide generation pipeline.
    """

    def __init__(self):
        self.llm = OpenRouterProvider()

    async def generate(self, pitch: SalesPitchInput) -> GeneratedSalesContent:
        """
        Generate sales pitch content from structured input.

        Args:
            pitch: Structured sales pitch data from the wizard form

        Returns:
            GeneratedSalesContent with text, title, and outline
        """
        logger.info(f"Generating sales content for: {pitch.product.name}")

        # Build the context from structured data
        context = self._build_context(pitch)

        # Generate content using LLM
        system_prompt = SALES_SYSTEM_PROMPT.format(
            tone=pitch.tone,
            audience=pitch.market.audience,
            industry=pitch.market.industry,
        )

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": context},
        ]

        response = await self.llm.complete(messages=messages, temperature=0.7)
        generated_text = response.get("completion", "")

        # Generate title if not provided
        title = await self._generate_title(pitch, generated_text)

        # Generate slide outline
        outline = self._generate_outline(pitch)

        logger.info(f"Generated sales content with {len(generated_text)} characters")

        return GeneratedSalesContent(
            text=generated_text,
            title=title,
            outline=outline,
        )

    def _build_context(self, pitch: SalesPitchInput) -> str:
        """Build context string from structured pitch data."""
        sections = []

        # Product section
        sections.append("## PRODUCT/SERVICE")
        sections.append(f"Name: {pitch.product.name}")
        if pitch.product.tagline:
            sections.append(f"Tagline: {pitch.product.tagline}")
        sections.append(f"Description: {pitch.product.description}")
        if pitch.product.key_features:
            sections.append(f"Key Features: {', '.join(pitch.product.key_features)}")
        if pitch.product.pricing:
            sections.append(f"Pricing: {pitch.product.pricing}")

        # Market section
        sections.append("\n## TARGET MARKET")
        sections.append(f"Industry: {pitch.market.industry}")
        sections.append(f"Audience: {pitch.market.audience}")
        if pitch.market.company_size:
            sections.append(f"Company Size: {pitch.market.company_size}")
        if pitch.market.geography:
            sections.append(f"Geography: {pitch.market.geography}")

        # Pain points section
        sections.append("\n## PAIN POINTS & SOLUTION")
        sections.append(f"Problems We Solve: {', '.join(pitch.pain_points.problems)}")
        if pitch.pain_points.current_solutions:
            sections.append(f"Current Solutions: {pitch.pain_points.current_solutions}")
        if pitch.pain_points.differentiators:
            sections.append(f"Our Differentiators: {', '.join(pitch.pain_points.differentiators)}")

        # Social proof section
        if pitch.social_proof:
            sections.append("\n## SOCIAL PROOF")
            if pitch.social_proof.metrics:
                sections.append(f"Success Metrics: {', '.join(pitch.social_proof.metrics)}")
            if pitch.social_proof.testimonials:
                sections.append("Testimonials:")
                for t in pitch.social_proof.testimonials:
                    sections.append(f'  - "{t}"')
            if pitch.social_proof.logos:
                sections.append(f"Notable Customers: {', '.join(pitch.social_proof.logos)}")

        # CTA section
        sections.append("\n## CALL TO ACTION")
        sections.append(f"Goal: {pitch.cta.goal}")
        if pitch.cta.urgency:
            sections.append(f"Urgency: {pitch.cta.urgency}")
        if pitch.cta.next_steps:
            sections.append(f"Next Steps: {', '.join(pitch.cta.next_steps)}")

        # Presentation settings
        sections.append(f"\n## SETTINGS")
        sections.append(f"Tone: {pitch.tone}")
        sections.append(f"Target Slides: {pitch.slide_count}")

        return "\n".join(sections)

    async def _generate_title(self, pitch: SalesPitchInput, content: str) -> str:
        """Generate a compelling presentation title."""
        prompt = f"""Generate a compelling, short presentation title (max 8 words) for this sales pitch.

Product: {pitch.product.name}
Audience: {pitch.market.audience}
Goal: {pitch.cta.goal}

The title should be:
- Benefit-focused, not product-focused
- Attention-grabbing
- Appropriate for {pitch.tone} tone

Return ONLY the title, nothing else."""

        messages = [{"role": "user", "content": prompt}]
        response = await self.llm.complete(messages=messages, temperature=0.8)
        title = response.get("completion", "") or pitch.product.name

        # Clean up the title
        return title.strip().strip('"').strip("'")

    def _generate_outline(self, pitch: SalesPitchInput) -> list[str]:
        """Generate a slide outline based on the pitch structure."""
        outline = [
            f"Title: {pitch.product.name}",
            "The Problem",
        ]

        # Add problem slides based on pain points
        if len(pitch.pain_points.problems) > 2:
            outline.append("Pain Points Deep Dive")

        outline.append(f"Introducing {pitch.product.name}")
        outline.append("Key Features & Benefits")

        if pitch.pain_points.differentiators:
            outline.append("Why We're Different")

        if pitch.social_proof and (pitch.social_proof.metrics or pitch.social_proof.testimonials):
            outline.append("Proven Results")

        if pitch.social_proof and pitch.social_proof.logos:
            outline.append("Trusted By")

        if pitch.product.pricing:
            outline.append("Pricing & Plans")

        outline.append(f"Call to Action: {pitch.cta.goal}")

        return outline
