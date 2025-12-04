"""
Export Service - shared PDF and PPTX generation logic
DRY: Used by both slides_api and public_api
"""

from packages.common.models import Presentation
from packages.common.services.pptx_export_service import generate_pptx as _generate_pptx


def generate_pptx(presentation: Presentation) -> bytes:
    """Generate PPTX bytes from a presentation"""
    return _generate_pptx(presentation)


def generate_pdf(presentation: Presentation) -> bytes:
    """Generate PDF bytes from a presentation using WeasyPrint"""
    from weasyprint import HTML

    html_content = _generate_slide_html(presentation)
    return HTML(string=html_content).write_pdf()


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
