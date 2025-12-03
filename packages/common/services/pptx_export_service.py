"""
PPTX Export Service - generates editable PowerPoint presentations
"""

from io import BytesIO
from typing import TypedDict

from pptx import Presentation as PptxPresentation
from pptx.chart.data import CategoryChartData
from pptx.dml.color import RGBColor
from pptx.enum.chart import XL_CHART_TYPE
from pptx.enum.text import PP_ALIGN
from pptx.util import Inches, Pt

from packages.common.models import Presentation, Slide
from packages.common.themes import get_theme


class ThemeColors(TypedDict):
    """Colors used for PPTX export"""

    bg: RGBColor
    accent: RGBColor
    text: RGBColor
    muted: RGBColor


def _hex_to_rgb(hex_color: str) -> RGBColor:
    """Convert hex color string to RGBColor"""
    h = hex_color.lstrip("#")
    return RGBColor(int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16))

# Slide dimensions (16:9)
SLIDE_WIDTH = Inches(13.333)
SLIDE_HEIGHT = Inches(7.5)

# Content margins
MARGIN_LEFT = Inches(1)
MARGIN_TOP = Inches(1)
CONTENT_WIDTH = Inches(11.333)
CONTENT_HEIGHT = Inches(5.5)


def generate_pptx(presentation: Presentation) -> bytes:
    """
    Generate a PPTX file from a presentation.

    Args:
        presentation: The presentation model with slides

    Returns:
        bytes: The PPTX file as bytes
    """
    # Get theme colors
    theme = get_theme(presentation.theme or "neobrutalism")
    colors: ThemeColors = {
        "bg": _hex_to_rgb(theme.colors.background),
        "accent": _hex_to_rgb(theme.colors.accent),
        "text": _hex_to_rgb(theme.colors.text_primary),
        "muted": _hex_to_rgb(theme.colors.text_secondary),
    }

    prs = PptxPresentation()
    prs.slide_width = SLIDE_WIDTH
    prs.slide_height = SLIDE_HEIGHT

    # Sort slides by order
    sorted_slides = sorted(presentation.slides, key=lambda s: s.order)

    for slide in sorted_slides:
        _add_slide(prs, slide, colors)

    # Write to bytes
    buffer = BytesIO()
    prs.save(buffer)
    buffer.seek(0)
    return buffer.read()


def _add_slide(prs: PptxPresentation, slide: Slide, colors: ThemeColors) -> None:
    """Add a slide to the presentation based on its type"""
    if slide.type == "title":
        _add_title_slide(prs, slide, colors)
    elif slide.type == "bullets":
        _add_bullets_slide(prs, slide, colors)
    elif slide.type == "quote":
        _add_quote_slide(prs, slide, colors)
    elif slide.type == "section":
        _add_section_slide(prs, slide, colors)
    elif slide.type == "chart":
        _add_chart_slide(prs, slide, colors)
    else:
        _add_content_slide(prs, slide, colors)


def _add_title_slide(prs: PptxPresentation, slide: Slide, colors: ThemeColors) -> None:
    """Add a title slide with centered title and subtitle"""
    blank_layout = prs.slide_layouts[6]  # Blank layout
    pptx_slide = prs.slides.add_slide(blank_layout)
    _set_slide_background(pptx_slide, colors)

    # Title - centered vertically and horizontally
    if slide.title:
        title_box = pptx_slide.shapes.add_textbox(
            MARGIN_LEFT,
            Inches(2.5),
            CONTENT_WIDTH,
            Inches(1.5),
        )
        title_frame = title_box.text_frame
        title_frame.word_wrap = True
        title_para = title_frame.paragraphs[0]
        title_para.text = slide.title
        title_para.font.size = Pt(60)
        title_para.font.bold = True
        title_para.font.color.rgb = colors["text"]
        title_para.alignment = PP_ALIGN.CENTER
        title_frame.auto_size = None

    # Subtitle
    if slide.subtitle:
        sub_box = pptx_slide.shapes.add_textbox(
            MARGIN_LEFT,
            Inches(4.2),
            CONTENT_WIDTH,
            Inches(1),
        )
        sub_frame = sub_box.text_frame
        sub_frame.word_wrap = True
        sub_para = sub_frame.paragraphs[0]
        sub_para.text = slide.subtitle
        sub_para.font.size = Pt(28)
        sub_para.font.color.rgb = colors["muted"]
        sub_para.alignment = PP_ALIGN.CENTER


def _add_bullets_slide(prs: PptxPresentation, slide: Slide, colors: ThemeColors) -> None:
    """Add a slide with title and bullet points"""
    blank_layout = prs.slide_layouts[6]
    pptx_slide = prs.slides.add_slide(blank_layout)
    _set_slide_background(pptx_slide, colors)

    # Title at top
    if slide.title:
        title_box = pptx_slide.shapes.add_textbox(
            MARGIN_LEFT,
            MARGIN_TOP,
            CONTENT_WIDTH,
            Inches(1),
        )
        title_frame = title_box.text_frame
        title_para = title_frame.paragraphs[0]
        title_para.text = slide.title
        title_para.font.size = Pt(40)
        title_para.font.bold = True
        title_para.font.color.rgb = colors["text"]

    # Bullets
    if slide.bullets:
        bullets_box = pptx_slide.shapes.add_textbox(
            MARGIN_LEFT,
            Inches(2.2),
            CONTENT_WIDTH,
            Inches(4.5),
        )
        bullets_frame = bullets_box.text_frame
        bullets_frame.word_wrap = True

        for i, bullet in enumerate(slide.bullets):
            if i == 0:
                para = bullets_frame.paragraphs[0]
            else:
                para = bullets_frame.add_paragraph()
            para.text = f"• {bullet}"
            para.font.size = Pt(24)
            para.font.color.rgb = colors["text"]
            para.space_after = Pt(16)


def _add_content_slide(prs: PptxPresentation, slide: Slide, colors: ThemeColors) -> None:
    """Add a slide with title and body text"""
    blank_layout = prs.slide_layouts[6]
    pptx_slide = prs.slides.add_slide(blank_layout)
    _set_slide_background(pptx_slide, colors)

    # Title
    if slide.title:
        title_box = pptx_slide.shapes.add_textbox(
            MARGIN_LEFT,
            MARGIN_TOP,
            CONTENT_WIDTH,
            Inches(1),
        )
        title_frame = title_box.text_frame
        title_para = title_frame.paragraphs[0]
        title_para.text = slide.title
        title_para.font.size = Pt(40)
        title_para.font.bold = True
        title_para.font.color.rgb = colors["text"]

    # Body text
    if slide.body:
        body_box = pptx_slide.shapes.add_textbox(
            MARGIN_LEFT,
            Inches(2.2),
            CONTENT_WIDTH,
            Inches(4.5),
        )
        body_frame = body_box.text_frame
        body_frame.word_wrap = True
        body_para = body_frame.paragraphs[0]
        body_para.text = slide.body
        body_para.font.size = Pt(24)
        body_para.font.color.rgb = colors["text"]
        body_para.line_spacing = 1.5


def _add_quote_slide(prs: PptxPresentation, slide: Slide, colors: ThemeColors) -> None:
    """Add a slide with a styled quote and attribution"""
    blank_layout = prs.slide_layouts[6]
    pptx_slide = prs.slides.add_slide(blank_layout)
    _set_slide_background(pptx_slide, colors)

    # Accent bar on left
    accent_bar = pptx_slide.shapes.add_shape(
        1,  # Rectangle
        Inches(1),
        Inches(2.5),
        Inches(0.08),
        Inches(2.5),
    )
    accent_bar.fill.solid()
    accent_bar.fill.fore_color.rgb = colors["accent"]
    accent_bar.line.fill.background()

    # Quote text
    if slide.quote:
        quote_box = pptx_slide.shapes.add_textbox(
            Inches(1.4),
            Inches(2.5),
            Inches(10),
            Inches(2),
        )
        quote_frame = quote_box.text_frame
        quote_frame.word_wrap = True
        quote_para = quote_frame.paragraphs[0]
        quote_para.text = f'"{slide.quote}"'
        quote_para.font.size = Pt(32)
        quote_para.font.italic = True
        quote_para.font.color.rgb = colors["text"]

    # Attribution
    if slide.attribution:
        attr_box = pptx_slide.shapes.add_textbox(
            Inches(1.4),
            Inches(5),
            Inches(10),
            Inches(0.5),
        )
        attr_frame = attr_box.text_frame
        attr_para = attr_frame.paragraphs[0]
        attr_para.text = f"— {slide.attribution}"
        attr_para.font.size = Pt(20)
        attr_para.font.color.rgb = colors["muted"]


def _add_section_slide(prs: PptxPresentation, slide: Slide, colors: ThemeColors) -> None:
    """Add a section divider slide with centered text"""
    blank_layout = prs.slide_layouts[6]
    pptx_slide = prs.slides.add_slide(blank_layout)
    _set_slide_background(pptx_slide, colors)

    if slide.title:
        title_box = pptx_slide.shapes.add_textbox(
            MARGIN_LEFT,
            Inches(3),
            CONTENT_WIDTH,
            Inches(1.5),
        )
        title_frame = title_box.text_frame
        title_frame.word_wrap = True
        title_para = title_frame.paragraphs[0]
        title_para.text = slide.title
        title_para.font.size = Pt(48)
        title_para.font.bold = True
        title_para.font.color.rgb = colors["text"]
        title_para.alignment = PP_ALIGN.CENTER


def _add_chart_slide(prs: PptxPresentation, slide: Slide, colors: ThemeColors) -> None:
    """Add a slide with a chart"""
    blank_layout = prs.slide_layouts[6]
    pptx_slide = prs.slides.add_slide(blank_layout)
    _set_slide_background(pptx_slide, colors)

    # Title
    if slide.title:
        title_box = pptx_slide.shapes.add_textbox(
            MARGIN_LEFT,
            MARGIN_TOP,
            CONTENT_WIDTH,
            Inches(1),
        )
        title_frame = title_box.text_frame
        title_para = title_frame.paragraphs[0]
        title_para.text = slide.title
        title_para.font.size = Pt(40)
        title_para.font.bold = True
        title_para.font.color.rgb = colors["text"]

    # Chart
    if slide.chart_data and slide.chart_type:
        chart_data = CategoryChartData()

        # Extract labels and values from chart_data
        labels = [point.get("label", "") for point in slide.chart_data]
        values = [point.get("value", 0) for point in slide.chart_data]

        chart_data.categories = labels
        chart_data.add_series("Data", values)

        # Map chart type to pptx chart type
        chart_type_map = {
            "bar": XL_CHART_TYPE.COLUMN_CLUSTERED,
            "horizontal_bar": XL_CHART_TYPE.BAR_CLUSTERED,
            "line": XL_CHART_TYPE.LINE,
            "pie": XL_CHART_TYPE.PIE,
            "donut": XL_CHART_TYPE.DOUGHNUT,
            "area": XL_CHART_TYPE.AREA,
        }
        xl_chart_type = chart_type_map.get(slide.chart_type, XL_CHART_TYPE.COLUMN_CLUSTERED)

        # Add chart
        chart_left = Inches(1.5)
        chart_top = Inches(2)
        chart_width = Inches(10)
        chart_height = Inches(5)

        pptx_slide.shapes.add_chart(
            xl_chart_type,
            chart_left,
            chart_top,
            chart_width,
            chart_height,
            chart_data,
        )
    else:
        # Fallback: show message if no chart data
        msg_box = pptx_slide.shapes.add_textbox(
            MARGIN_LEFT,
            Inches(3.5),
            CONTENT_WIDTH,
            Inches(1),
        )
        msg_frame = msg_box.text_frame
        msg_para = msg_frame.paragraphs[0]
        msg_para.text = "[Chart data not available]"
        msg_para.font.size = Pt(20)
        msg_para.font.color.rgb = colors["muted"]
        msg_para.alignment = PP_ALIGN.CENTER


def _set_slide_background(pptx_slide, colors: ThemeColors) -> None:
    """Set the background color for a slide based on theme"""
    background = pptx_slide.background
    fill = background.fill
    fill.solid()
    fill.fore_color.rgb = colors["bg"]
