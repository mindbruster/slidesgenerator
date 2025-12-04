"""
Public API - Export endpoints for PDF and PPTX
"""

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse

from packages.common.core.database import AsyncSessionDep
from packages.common.services.presentation_service import PresentationService
from packages.common.services.export_service import generate_pdf, generate_pptx

from apps.public_api.dependencies import RequireAPIKey

router = APIRouter()


@router.get("/pdf/{presentation_id}")
async def export_pdf(
    presentation_id: int,
    db: AsyncSessionDep,
    api_key: RequireAPIKey,
) -> StreamingResponse:
    """
    Export presentation to PDF.

    Only exports presentations owned by the authenticated API key.
    """
    service = PresentationService(db)
    presentation = await service.get_by_id(presentation_id, api_key_id=api_key.id)

    if not presentation:
        raise HTTPException(status_code=404, detail="Presentation not found")

    try:
        pdf_bytes = generate_pdf(presentation)

        return StreamingResponse(
            iter([pdf_bytes]),
            media_type="application/pdf",
            headers={
                "Content-Disposition": f'attachment; filename="{presentation.title}.pdf"'
            },
        )
    except ImportError:
        raise HTTPException(
            status_code=501,
            detail="PDF export requires WeasyPrint. Install with: pip install weasyprint",
        ) from None


@router.get("/pptx/{presentation_id}")
async def export_pptx(
    presentation_id: int,
    db: AsyncSessionDep,
    api_key: RequireAPIKey,
) -> StreamingResponse:
    """
    Export presentation to PPTX (PowerPoint).

    Only exports presentations owned by the authenticated API key.
    """
    service = PresentationService(db)
    presentation = await service.get_by_id(presentation_id, api_key_id=api_key.id)

    if not presentation:
        raise HTTPException(status_code=404, detail="Presentation not found")

    pptx_bytes = generate_pptx(presentation)

    return StreamingResponse(
        iter([pptx_bytes]),
        media_type="application/vnd.openxmlformats-officedocument.presentationml.presentation",
        headers={
            "Content-Disposition": f'attachment; filename="{presentation.title}.pptx"'
        },
    )
