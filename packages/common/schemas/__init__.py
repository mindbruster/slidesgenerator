# Pydantic schemas
from packages.common.schemas.api_key_schema import (
    APIKeyCreate,
    APIKeyCreateResponse,
    APIKeyListResponse,
    APIKeyResponse,
    APIKeyUpdate,
    APIKeyValidation,
)
from packages.common.schemas.slide_schema import (
    SlideBase,
    SlideCreate,
    SlideResponse,
    SlideUpdate,
)
from packages.common.schemas.presentation_schema import (
    GenerateSlidesRequest,
    GenerateSlidesResponse,
    PresentationBase,
    PresentationCreate,
    PresentationResponse,
    PresentationUpdate,
    SalesContext,
)
from packages.common.schemas.sales_schema import (
    CallToAction,
    GenerateSalesPitchRequest,
    PainPoints,
    ProductInfo,
    SalesPitchInput,
    SalesPitchTextResponse,
    SocialProof,
    TargetMarket,
)
from packages.common.schemas.template_schema import (
    CategoryCount,
    TemplateBase,
    TemplateCategory,
    TemplateCreate,
    TemplateGenerateRequest,
    TemplateListResponse,
    TemplateResponse,
    TemplateSlideBase,
    TemplateSlideCreate,
    TemplateSlideResponse,
    TemplateUpdate,
)

__all__ = [
    # API Keys
    "APIKeyCreate",
    "APIKeyCreateResponse",
    "APIKeyListResponse",
    "APIKeyResponse",
    "APIKeyUpdate",
    "APIKeyValidation",
    # Slides
    "SlideBase",
    "SlideCreate",
    "SlideResponse",
    "SlideUpdate",
    # Presentations
    "GenerateSlidesRequest",
    "GenerateSlidesResponse",
    "PresentationBase",
    "PresentationCreate",
    "PresentationResponse",
    "PresentationUpdate",
    "SalesContext",
    # Sales
    "CallToAction",
    "GenerateSalesPitchRequest",
    "PainPoints",
    "ProductInfo",
    "SalesPitchInput",
    "SalesPitchTextResponse",
    "SocialProof",
    "TargetMarket",
    # Templates
    "CategoryCount",
    "TemplateBase",
    "TemplateCategory",
    "TemplateCreate",
    "TemplateGenerateRequest",
    "TemplateListResponse",
    "TemplateResponse",
    "TemplateSlideBase",
    "TemplateSlideCreate",
    "TemplateSlideResponse",
    "TemplateUpdate",
]
