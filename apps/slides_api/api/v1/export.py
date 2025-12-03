"""
Export endpoints for PDF and shareable links
"""

import base64
import json

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from packages.common.core.database import AsyncSessionDep
from packages.common.models import Presentation
from packages.common.schemas import PresentationResponse

router = APIRouter()


class ExportLinkResponse(BaseModel):
    """Response for shareable link creation"""

    url: str
    share_code: str


@router.post("/link/{presentation_id}", response_model=ExportLinkResponse)
async def create_share_link(
    presentation_id: int,
    db: AsyncSessionDep,
) -> ExportLinkResponse:
    """
    Create a shareable link for a presentation.

    For MVP: Returns base64-encoded presentation ID.
    Future: Store with short URL service.
    """
    # Verify presentation exists
    query = select(Presentation).where(Presentation.id == presentation_id)
    result = await db.execute(query)
    presentation = result.scalar_one_or_none()

    if not presentation:
        raise HTTPException(status_code=404, detail="Presentation not found")

    # Create share code
    share_code = base64.urlsafe_b64encode(str(presentation_id).encode()).decode()

    return ExportLinkResponse(
        url=f"/view/{share_code}",
        share_code=share_code,
    )


@router.get("/pdf/{presentation_id}")
async def export_pdf(
    presentation_id: int,
    db: AsyncSessionDep,
) -> StreamingResponse:
    """
    Export presentation to PDF.

    Uses WeasyPrint for high-quality PDF generation.
    """
    # Get presentation with slides
    query = (
        select(Presentation)
        .options(selectinload(Presentation.slides))
        .where(Presentation.id == presentation_id)
    )
    result = await db.execute(query)
    presentation = result.scalar_one_or_none()

    if not presentation:
        raise HTTPException(status_code=404, detail="Presentation not found")

    # Generate HTML for slides
    html_content = _generate_slide_html(presentation)

    try:
        from weasyprint import HTML

        pdf_bytes = HTML(string=html_content).write_pdf()

        return StreamingResponse(
            iter([pdf_bytes]),
            media_type="application/pdf",
            headers={
                "Content-Disposition": f'attachment; filename="{presentation.title}.pdf"'
            },
        )
    except ImportError:
        # WeasyPrint not installed - return error
        raise HTTPException(
            status_code=501,
            detail="PDF export requires WeasyPrint. Install with: pip install weasyprint",
        ) from None


def _generate_slide_html(presentation: Presentation) -> str:
    """Generate HTML representation of slides for PDF export"""
    slides_html = ""

    for slide in presentation.slides:
        slide_content = ""

        if slide.type == "title":
            slide_content = f"""
                <div class="title-slide">
                    <h1>{slide.title or ''}</h1>
                    {f'<p class="subtitle">{slide.subtitle}</p>' if slide.subtitle else ''}
                </div>
            """
        elif slide.type == "bullets" and slide.bullets:
            bullets = "".join(f"<li>{b}</li>" for b in slide.bullets)
            slide_content = f"""
                <div class="bullets-slide">
                    {f'<h2>{slide.title}</h2>' if slide.title else ''}
                    <ul>{bullets}</ul>
                </div>
            """
        elif slide.type == "quote":
            slide_content = f"""
                <div class="quote-slide">
                    <blockquote>"{slide.quote or ''}"</blockquote>
                    {f'<cite>— {slide.attribution}</cite>' if slide.attribution else ''}
                </div>
            """
        elif slide.type == "section":
            slide_content = f"""
                <div class="section-slide">
                    <h2>{slide.title or ''}</h2>
                </div>
            """
        else:
            slide_content = f"""
                <div class="content-slide">
                    {f'<h2>{slide.title}</h2>' if slide.title else ''}
                    {f'<p>{slide.body}</p>' if slide.body else ''}
                </div>
            """

        slides_html += f'<div class="slide">{slide_content}</div>'

    return f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            @page {{
                size: 1280px 720px;
                margin: 0;
            }}
            body {{
                margin: 0;
                padding: 0;
                font-family: 'Inter', -apple-system, sans-serif;
            }}
            .slide {{
                width: 1280px;
                height: 720px;
                padding: 80px;
                box-sizing: border-box;
                page-break-after: always;
                display: flex;
                flex-direction: column;
                justify-content: center;
                background: #f4f4f0;
            }}
            .slide:last-child {{
                page-break-after: auto;
            }}
            h1 {{
                font-size: 72px;
                font-weight: 700;
                margin: 0 0 24px 0;
                color: #0f0f0f;
            }}
            h2 {{
                font-size: 48px;
                font-weight: 700;
                margin: 0 0 32px 0;
                color: #0f0f0f;
            }}
            p, li {{
                font-size: 28px;
                line-height: 1.6;
                color: #0f0f0f;
            }}
            .subtitle {{
                font-size: 32px;
                color: #6b6b6b;
            }}
            ul {{
                margin: 0;
                padding-left: 40px;
            }}
            li {{
                margin-bottom: 16px;
            }}
            blockquote {{
                font-size: 36px;
                font-style: italic;
                margin: 0;
                padding-left: 32px;
                border-left: 4px solid #ff90e8;
            }}
            cite {{
                display: block;
                margin-top: 24px;
                font-size: 24px;
                color: #6b6b6b;
            }}
            .title-slide {{
                text-align: center;
            }}
            .section-slide {{
                text-align: center;
            }}
            .section-slide h2 {{
                font-size: 56px;
            }}
        </style>
    </head>
    <body>
        {slides_html}
    </body>
    </html>
    """
