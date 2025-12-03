# Pydantic schemas
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
)

__all__ = [
    "SlideBase",
    "SlideCreate",
    "SlideResponse",
    "SlideUpdate",
    "GenerateSlidesRequest",
    "GenerateSlidesResponse",
    "PresentationBase",
    "PresentationCreate",
    "PresentationResponse",
    "PresentationUpdate",
]
