"""
Export Service - shared PDF and PPTX generation logic
DRY: Used by both slides_api and public_api
"""

import base64
from io import BytesIO

import matplotlib
matplotlib.use('Agg')  # Use non-interactive backend
import matplotlib.pyplot as plt
import numpy as np

from packages.common.models import Presentation, Slide
from packages.common.services.pptx_export_service import generate_pptx as _generate_pptx
from packages.common.themes import get_theme


def generate_pptx(presentation: Presentation) -> bytes:
    """Generate PPTX bytes from a presentation"""
    return _generate_pptx(presentation)


def generate_pdf(presentation: Presentation) -> bytes:
    """Generate PDF bytes from a presentation using WeasyPrint"""
    from weasyprint import HTML

    html_content = _generate_slide_html(presentation)
    return HTML(string=html_content).write_pdf()


def _generate_chart_image(slide: Slide, theme_colors: dict) -> str:
    """Generate a chart image as base64 encoded PNG using matplotlib"""
    if not slide.chart_data or not slide.chart_type:
        return ""

    # Extract data
    labels = [point.get("label", "") for point in slide.chart_data]
    values = [point.get("value", 0) for point in slide.chart_data]

    # Get colors from chart_data or use theme accent
    colors = []
    for i, point in enumerate(slide.chart_data):
        if "color" in point:
            colors.append(point["color"])
        else:
            # Generate colors from theme accent with varying opacity
            colors.append(theme_colors.get("accent", "#ff90e8"))

    # Create figure with transparent background
    fig, ax = plt.subplots(figsize=(10, 5), facecolor=theme_colors.get("background", "#f4f4f0"))
    ax.set_facecolor(theme_colors.get("background", "#f4f4f0"))

    chart_type = slide.chart_type

    if chart_type == "bar":
        bars = ax.bar(labels, values, color=colors, edgecolor=theme_colors.get("text", "#0f0f0f"), linewidth=1.5)
        ax.set_ylabel("Value", fontsize=12, color=theme_colors.get("text", "#0f0f0f"))
        # Add value labels on bars
        for bar, value in zip(bars, values):
            height = bar.get_height()
            ax.annotate(f'{value}',
                       xy=(bar.get_x() + bar.get_width() / 2, height),
                       xytext=(0, 3), textcoords="offset points",
                       ha='center', va='bottom', fontsize=10,
                       color=theme_colors.get("text", "#0f0f0f"))

    elif chart_type == "horizontal_bar":
        bars = ax.barh(labels, values, color=colors, edgecolor=theme_colors.get("text", "#0f0f0f"), linewidth=1.5)
        ax.set_xlabel("Value", fontsize=12, color=theme_colors.get("text", "#0f0f0f"))
        # Add value labels on bars
        for bar, value in zip(bars, values):
            width = bar.get_width()
            ax.annotate(f'{value}',
                       xy=(width, bar.get_y() + bar.get_height() / 2),
                       xytext=(3, 0), textcoords="offset points",
                       ha='left', va='center', fontsize=10,
                       color=theme_colors.get("text", "#0f0f0f"))

    elif chart_type == "line":
        ax.plot(labels, values, marker='o', markersize=10, linewidth=3,
                color=theme_colors.get("accent", "#ff90e8"),
                markerfacecolor=theme_colors.get("background", "#f4f4f0"),
                markeredgecolor=theme_colors.get("accent", "#ff90e8"),
                markeredgewidth=2)
        ax.set_ylabel("Value", fontsize=12, color=theme_colors.get("text", "#0f0f0f"))
        # Add value labels
        for i, (label, value) in enumerate(zip(labels, values)):
            ax.annotate(f'{value}', xy=(i, value), xytext=(0, 10),
                       textcoords="offset points", ha='center',
                       fontsize=10, color=theme_colors.get("text", "#0f0f0f"))

    elif chart_type in ("pie", "donut"):
        # Use different colors for each slice
        slice_colors = colors if len(set(colors)) > 1 else plt.cm.Pastel1(np.linspace(0, 1, len(values)))
        wedges, texts, autotexts = ax.pie(
            values, labels=labels, autopct='%1.1f%%',
            colors=slice_colors,
            wedgeprops=dict(edgecolor=theme_colors.get("text", "#0f0f0f"), linewidth=2),
            textprops=dict(color=theme_colors.get("text", "#0f0f0f"), fontsize=11)
        )
        for autotext in autotexts:
            autotext.set_fontsize(10)
            autotext.set_color(theme_colors.get("text", "#0f0f0f"))

        if chart_type == "donut":
            # Create donut hole
            centre_circle = plt.Circle((0, 0), 0.5, fc=theme_colors.get("background", "#f4f4f0"),
                                       ec=theme_colors.get("text", "#0f0f0f"), linewidth=2)
            ax.add_artist(centre_circle)

    elif chart_type == "area":
        ax.fill_between(range(len(values)), values, alpha=0.6,
                        color=theme_colors.get("accent", "#ff90e8"),
                        edgecolor=theme_colors.get("text", "#0f0f0f"), linewidth=2)
        ax.plot(range(len(values)), values, color=theme_colors.get("accent", "#ff90e8"),
                linewidth=2, marker='o', markersize=6)
        ax.set_xticks(range(len(labels)))
        ax.set_xticklabels(labels)
        ax.set_ylabel("Value", fontsize=12, color=theme_colors.get("text", "#0f0f0f"))

    # Style the axes
    ax.tick_params(colors=theme_colors.get("text", "#0f0f0f"), labelsize=11)
    for spine in ax.spines.values():
        spine.set_color(theme_colors.get("text", "#0f0f0f"))
        spine.set_linewidth(1.5)

    # Remove top and right spines for cleaner look (except pie/donut)
    if chart_type not in ("pie", "donut"):
        ax.spines['top'].set_visible(False)
        ax.spines['right'].set_visible(False)

    plt.tight_layout()

    # Save to bytes
    buffer = BytesIO()
    plt.savefig(buffer, format='png', dpi=150, bbox_inches='tight',
                facecolor=theme_colors.get("background", "#f4f4f0"),
                edgecolor='none')
    buffer.seek(0)
    plt.close(fig)

    # Encode as base64
    img_base64 = base64.b64encode(buffer.read()).decode('utf-8')
    return f'data:image/png;base64,{img_base64}'


def _generate_slide_html(presentation: Presentation) -> str:
    """Generate HTML representation of slides for PDF export"""
    # Get theme colors
    theme = get_theme(presentation.theme or "neobrutalism")
    theme_colors = {
        "background": theme.colors.background,
        "accent": theme.colors.accent,
        "text": theme.colors.text_primary,
        "muted": theme.colors.text_secondary,
    }

    slides_html = ""

    for slide in sorted(presentation.slides, key=lambda s: s.order):
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
            image_html = ""
            if slide.image_url:
                image_html = f"""
                    <div class="slide-image">
                        <img src="{slide.image_url}" alt="{slide.image_alt or ''}" />
                        {f'<p class="image-credit">{slide.image_credit}</p>' if slide.image_credit else ''}
                    </div>
                """
            slide_content = f"""
                <div class="bullets-slide {'with-image' if slide.image_url else ''}">
                    <div class="text-content">
                        {f'<h2>{slide.title}</h2>' if slide.title else ''}
                        <ul>{bullets}</ul>
                    </div>
                    {image_html}
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
        elif slide.type == "chart" and slide.chart_data:
            # Generate chart image
            chart_img = _generate_chart_image(slide, theme_colors)
            slide_content = f"""
                <div class="chart-slide">
                    {f'<h2>{slide.title}</h2>' if slide.title else ''}
                    <div class="chart-container">
                        <img src="{chart_img}" alt="Chart" class="chart-image" />
                    </div>
                </div>
            """
        else:
            image_html = ""
            if slide.image_url:
                image_html = f"""
                    <div class="slide-image">
                        <img src="{slide.image_url}" alt="{slide.image_alt or ''}" />
                        {f'<p class="image-credit">{slide.image_credit}</p>' if slide.image_credit else ''}
                    </div>
                """
            slide_content = f"""
                <div class="content-slide {'with-image' if slide.image_url else ''}">
                    <div class="text-content">
                        {f'<h2>{slide.title}</h2>' if slide.title else ''}
                        {f'<p>{slide.body}</p>' if slide.body else ''}
                    </div>
                    {image_html}
                </div>
            """

        slides_html += f'<div class="slide" style="background: {theme_colors["background"]};">{slide_content}</div>'

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
                background: {theme_colors["background"]};
            }}
            .slide:last-child {{
                page-break-after: auto;
            }}
            h1 {{
                font-size: 72px;
                font-weight: 700;
                margin: 0 0 24px 0;
                color: {theme_colors["text"]};
            }}
            h2 {{
                font-size: 48px;
                font-weight: 700;
                margin: 0 0 32px 0;
                color: {theme_colors["text"]};
            }}
            p, li {{
                font-size: 28px;
                line-height: 1.6;
                color: {theme_colors["text"]};
            }}
            .subtitle {{
                font-size: 32px;
                color: {theme_colors["muted"]};
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
                border-left: 4px solid {theme_colors["accent"]};
            }}
            cite {{
                display: block;
                margin-top: 24px;
                font-size: 24px;
                color: {theme_colors["muted"]};
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
            .chart-slide {{
                display: flex;
                flex-direction: column;
                align-items: center;
            }}
            .chart-slide h2 {{
                text-align: center;
                margin-bottom: 40px;
            }}
            .chart-container {{
                display: flex;
                justify-content: center;
                align-items: center;
                flex: 1;
            }}
            .chart-image {{
                max-width: 100%;
                max-height: 450px;
                object-fit: contain;
            }}
            /* Image slides layout */
            .with-image {{
                display: flex;
                flex-direction: row;
                gap: 40px;
                align-items: center;
            }}
            .with-image .text-content {{
                flex: 1;
            }}
            .with-image .slide-image {{
                flex: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
            }}
            .slide-image img {{
                max-width: 100%;
                max-height: 400px;
                object-fit: cover;
                border-radius: 12px;
                border: 2px solid {theme_colors["text"]};
            }}
            .image-credit {{
                font-size: 14px;
                color: {theme_colors["muted"]};
                margin-top: 8px;
                opacity: 0.7;
            }}
        </style>
    </head>
    <body>
        {slides_html}
    </body>
    </html>
    """
