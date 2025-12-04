"""
Sales Pitch Generation schemas
Structured input for generating sales-focused presentations
"""

from pydantic import BaseModel, Field


class ProductInfo(BaseModel):
    """Product/Service information"""

    name: str = Field(..., min_length=1, max_length=100, description="Product or service name")
    tagline: str | None = Field(
        default=None, max_length=200, description="Short tagline or value proposition"
    )
    description: str = Field(
        ..., min_length=20, max_length=2000, description="What the product/service does"
    )
    key_features: list[str] = Field(
        default_factory=list,
        max_length=8,
        description="Key features or capabilities (3-8 items)",
    )
    pricing: str | None = Field(
        default=None, max_length=200, description="Pricing info (e.g., 'Starting at $99/mo')"
    )


class TargetMarket(BaseModel):
    """Target market information"""

    industry: str = Field(
        ...,
        max_length=100,
        description="Target industry (e.g., SaaS, Healthcare, E-commerce, Finance)",
    )
    audience: str = Field(
        ...,
        max_length=100,
        description="Target audience (e.g., CTOs, Small Business Owners, Marketing Teams)",
    )
    company_size: str | None = Field(
        default=None,
        max_length=50,
        description="Target company size (e.g., Startups, SMB, Enterprise)",
    )
    geography: str | None = Field(
        default=None, max_length=100, description="Target geography (e.g., US, Global, EMEA)"
    )


class PainPoints(BaseModel):
    """Customer pain points and solutions"""

    problems: list[str] = Field(
        ...,
        min_length=1,
        max_length=6,
        description="Customer pain points your product solves (1-6 items)",
    )
    current_solutions: str | None = Field(
        default=None,
        max_length=500,
        description="How customers currently solve this (competitors, manual process)",
    )
    differentiators: list[str] = Field(
        default_factory=list,
        max_length=5,
        description="What makes you different from alternatives",
    )


class SocialProof(BaseModel):
    """Testimonials and credibility"""

    testimonials: list[str] = Field(
        default_factory=list,
        max_length=4,
        description="Customer quotes or testimonials",
    )
    metrics: list[str] = Field(
        default_factory=list,
        max_length=6,
        description="Success metrics (e.g., '50% cost reduction', '10x faster')",
    )
    logos: list[str] = Field(
        default_factory=list,
        max_length=8,
        description="Notable customer/partner names",
    )


class CallToAction(BaseModel):
    """Desired outcome"""

    goal: str = Field(
        ...,
        max_length=100,
        description="Primary goal (e.g., Schedule demo, Start free trial, Get funding)",
    )
    urgency: str | None = Field(
        default=None,
        max_length=200,
        description="Urgency driver (e.g., Limited time offer, Exclusive beta access)",
    )
    next_steps: list[str] = Field(
        default_factory=list,
        max_length=4,
        description="Clear next steps for the audience",
    )


class SalesPitchInput(BaseModel):
    """Complete sales pitch input - wizard collects this data"""

    # Step 1: Product
    product: ProductInfo

    # Step 2: Market
    market: TargetMarket

    # Step 3: Problem/Solution
    pain_points: PainPoints

    # Step 4: Proof
    social_proof: SocialProof | None = None

    # Step 5: CTA
    cta: CallToAction

    # Presentation settings
    tone: str = Field(
        default="professional",
        description="Tone: professional, persuasive, casual, technical, inspirational",
    )
    slide_count: int = Field(default=10, ge=6, le=15, description="Target number of slides")
    theme: str = Field(default="corporate", description="Presentation theme")


class GenerateSalesPitchRequest(BaseModel):
    """API request for sales pitch generation"""

    pitch: SalesPitchInput
    title: str | None = Field(
        default=None, max_length=255, description="Optional custom title"
    )


class SalesPitchTextResponse(BaseModel):
    """Intermediate response with generated sales content"""

    generated_text: str = Field(..., description="Generated sales pitch content")
    suggested_title: str = Field(..., description="Suggested presentation title")
    slide_outline: list[str] = Field(..., description="Outline of slides to be generated")
