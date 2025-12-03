"""
Theme definitions for Decksnap presentations.
Centralized color and styling configuration shared across backend services.

This module provides comprehensive theming support including:
- Colors: Full color palette with accent variations
- Typography: Font families, sizes, weights, and styling
- Visual Style: Borders, shadows, patterns, and decorations
- Spacing: Padding, gaps, and margins
- Layout: Alignment and positioning defaults
"""

from dataclasses import dataclass, field
from enum import Enum
from typing import Literal


class ThemeName(str, Enum):
    """Available theme names."""

    NEOBRUTALISM = "neobrutalism"
    CORPORATE = "corporate"
    MINIMAL = "minimal"
    DARK = "dark"
    MAGAZINE = "magazine"
    TERMINAL = "terminal"
    PLAYFUL = "playful"


# =============================================================================
# COLOR DEFINITIONS
# =============================================================================


@dataclass(frozen=True)
class ThemeColors:
    """Color palette for a theme."""

    background: str  # Main background (hex)
    surface: str  # Card/elevated surface
    text_primary: str  # Main text
    text_secondary: str  # Muted text
    accent: str  # Primary accent color
    accent_hover: str  # Accent hover state
    accent_light: str  # Light accent variant
    border: str  # Border color
    border_dark: str  # Dark border for emphasis


# =============================================================================
# TYPOGRAPHY DEFINITIONS
# =============================================================================


@dataclass(frozen=True)
class ThemeTypography:
    """Typography configuration for a theme."""

    heading_font: str  # Font family for headings
    body_font: str  # Font family for body text
    google_fonts: list[str] = field(default_factory=list)  # Google Font URLs

    # Title slide typography
    title_size: str = "6xl"  # Tailwind size class
    title_weight: int = 700
    title_letter_spacing: str = "-0.02em"
    title_transform: Literal["none", "uppercase", "lowercase", "capitalize"] = "none"
    title_line_height: float = 1.1

    # Heading typography
    heading_size: str = "4xl"
    heading_weight: int = 700
    heading_letter_spacing: str = "-0.01em"

    # Body typography
    body_size: str = "xl"
    body_weight: int = 400
    body_line_height: float = 1.6

    # Quote typography
    quote_size: str = "3xl"
    quote_style: Literal["normal", "italic"] = "italic"


# =============================================================================
# VISUAL STYLE DEFINITIONS
# =============================================================================


@dataclass(frozen=True)
class ThemeStyle:
    """Visual style configuration for a theme."""

    # Border settings
    border_width: str = "2px"
    border_style: Literal["solid", "dashed", "dotted", "none"] = "solid"
    border_radius: str = "16px"

    # Shadow (CSS box-shadow value or null)
    shadow: str | None = "4px 4px 0px 0px"  # Shadow without color - color applied from theme

    # Accent bar decoration
    accent_bar_position: Literal["none", "top", "left", "bottom"] = "none"
    accent_bar_width: str = "4px"

    # Background pattern
    background_pattern: Literal["none", "dots", "grid", "scanlines", "noise"] = "none"
    pattern_opacity: float = 0.05


# =============================================================================
# SPACING DEFINITIONS
# =============================================================================


@dataclass(frozen=True)
class ThemeSpacing:
    """Spacing configuration for a theme."""

    slide_padding: str = "80px"
    element_gap: str = "24px"
    bullet_gap: str = "16px"
    content_max_width: str = "100%"


# =============================================================================
# DECORATION DEFINITIONS
# =============================================================================


@dataclass(frozen=True)
class ThemeDecorations:
    """Decorative element configuration for a theme."""

    bullet_style: Literal["disc", "dash", "arrow", "number", "check", "square"] = "disc"
    bullet_size: str = "8px"
    quote_style: Literal["large-mark", "accent-bar", "icon", "none"] = "large-mark"
    section_divider: Literal["line", "accent-block", "gradient", "none"] = "line"


# =============================================================================
# LAYOUT DEFINITIONS
# =============================================================================


@dataclass(frozen=True)
class ThemeLayout:
    """Layout configuration for a theme."""

    title_alignment: Literal["left", "center", "right"] = "center"
    content_alignment: Literal["left", "center", "right"] = "left"
    vertical_position: Literal["top", "center", "bottom"] = "center"


# =============================================================================
# COMPLETE THEME DEFINITION
# =============================================================================


@dataclass(frozen=True)
class Theme:
    """Complete theme definition with full creative control."""

    name: ThemeName
    display_name: str
    description: str
    colors: ThemeColors
    typography: ThemeTypography
    style: ThemeStyle = field(default_factory=ThemeStyle)
    spacing: ThemeSpacing = field(default_factory=ThemeSpacing)
    decorations: ThemeDecorations = field(default_factory=ThemeDecorations)
    layout: ThemeLayout = field(default_factory=ThemeLayout)


# =============================================================================
# THEME DEFINITIONS
# =============================================================================

THEMES: dict[str, Theme] = {
    # -------------------------------------------------------------------------
    # NEOBRUTALISM - Bold, playful style with offset shadows
    # -------------------------------------------------------------------------
    "neobrutalism": Theme(
        name=ThemeName.NEOBRUTALISM,
        display_name="Neobrutalism",
        description="Bold, playful style with offset shadows and pink accents",
        colors=ThemeColors(
            background="#f4f4f0",
            surface="#ffffff",
            text_primary="#0f0f0f",
            text_secondary="#6b6b6b",
            accent="#ff90e8",
            accent_hover="#ff6bdf",
            accent_light="#ffd6f5",
            border="#e5e5e5",
            border_dark="#0f0f0f",
        ),
        typography=ThemeTypography(
            heading_font="system-ui, -apple-system, sans-serif",
            body_font="system-ui, -apple-system, sans-serif",
            title_size="6xl",
            title_weight=800,
            title_letter_spacing="-0.02em",
            heading_weight=700,
            body_line_height=1.6,
        ),
        style=ThemeStyle(
            border_width="2px",
            border_style="solid",
            border_radius="16px",
            shadow="4px 4px 0px 0px",
            accent_bar_position="top",
            accent_bar_width="4px",
        ),
        spacing=ThemeSpacing(
            slide_padding="80px",
            element_gap="24px",
            bullet_gap="16px",
        ),
        decorations=ThemeDecorations(
            bullet_style="disc",
            bullet_size="10px",
            quote_style="large-mark",
            section_divider="accent-block",
        ),
        layout=ThemeLayout(
            title_alignment="center",
            content_alignment="left",
            vertical_position="center",
        ),
    ),
    # -------------------------------------------------------------------------
    # CORPORATE - Clean, professional with numbered lists
    # -------------------------------------------------------------------------
    "corporate": Theme(
        name=ThemeName.CORPORATE,
        display_name="Corporate",
        description="Clean, professional look with blue accents and numbered lists",
        colors=ThemeColors(
            background="#ffffff",
            surface="#f8fafc",
            text_primary="#1e293b",
            text_secondary="#64748b",
            accent="#2563eb",
            accent_hover="#1d4ed8",
            accent_light="#dbeafe",
            border="#e2e8f0",
            border_dark="#1e293b",
        ),
        typography=ThemeTypography(
            heading_font="Inter, system-ui, sans-serif",
            body_font="Inter, system-ui, sans-serif",
            google_fonts=["Inter:wght@400;500;600;700"],
            title_size="5xl",
            title_weight=600,
            title_letter_spacing="-0.01em",
            heading_size="3xl",
            heading_weight=600,
            body_line_height=1.7,
        ),
        style=ThemeStyle(
            border_width="1px",
            border_style="solid",
            border_radius="8px",
            shadow="0 4px 6px -1px rgba(0,0,0,0.1)",
            accent_bar_position="left",
            accent_bar_width="3px",
        ),
        spacing=ThemeSpacing(
            slide_padding="96px",
            element_gap="32px",
            bullet_gap="12px",
        ),
        decorations=ThemeDecorations(
            bullet_style="number",
            bullet_size="24px",
            quote_style="accent-bar",
            section_divider="line",
        ),
        layout=ThemeLayout(
            title_alignment="left",
            content_alignment="left",
            vertical_position="center",
        ),
    ),
    # -------------------------------------------------------------------------
    # MINIMAL - Ultra-clean with thin typography
    # -------------------------------------------------------------------------
    "minimal": Theme(
        name=ThemeName.MINIMAL,
        display_name="Minimal",
        description="Ultra-clean with thin typography and maximum whitespace",
        colors=ThemeColors(
            background="#ffffff",
            surface="#fafafa",
            text_primary="#18181b",
            text_secondary="#71717a",
            accent="#18181b",
            accent_hover="#09090b",
            accent_light="#f4f4f5",
            border="#e4e4e7",
            border_dark="#18181b",
        ),
        typography=ThemeTypography(
            heading_font="Inter, system-ui, sans-serif",
            body_font="Inter, system-ui, sans-serif",
            google_fonts=["Inter:wght@300;400;500;600"],
            title_size="5xl",
            title_weight=500,
            title_letter_spacing="-0.02em",
            heading_size="3xl",
            heading_weight=500,
            body_weight=300,
            body_line_height=1.8,
            quote_style="normal",
        ),
        style=ThemeStyle(
            border_width="1px",
            border_style="solid",
            border_radius="4px",
            shadow=None,
            accent_bar_position="none",
        ),
        spacing=ThemeSpacing(
            slide_padding="100px",
            element_gap="40px",
            bullet_gap="20px",
            content_max_width="80%",
        ),
        decorations=ThemeDecorations(
            bullet_style="dash",
            bullet_size="16px",
            quote_style="none",
            section_divider="none",
        ),
        layout=ThemeLayout(
            title_alignment="left",
            content_alignment="left",
            vertical_position="center",
        ),
    ),
    # -------------------------------------------------------------------------
    # DARK - Modern dark mode with glow effects
    # -------------------------------------------------------------------------
    "dark": Theme(
        name=ThemeName.DARK,
        display_name="Dark",
        description="Modern dark mode with purple accents and subtle glow",
        colors=ThemeColors(
            background="#0f0f0f",
            surface="#1a1a1a",
            text_primary="#f4f4f5",
            text_secondary="#a1a1aa",
            accent="#a78bfa",
            accent_hover="#8b5cf6",
            accent_light="#2e1065",
            border="#27272a",
            border_dark="#3f3f46",
        ),
        typography=ThemeTypography(
            heading_font="Inter, system-ui, sans-serif",
            body_font="Inter, system-ui, sans-serif",
            google_fonts=["Inter:wght@400;500;600;700"],
            title_size="6xl",
            title_weight=700,
            heading_weight=600,
            body_line_height=1.6,
        ),
        style=ThemeStyle(
            border_width="1px",
            border_style="solid",
            border_radius="12px",
            shadow="0 0 20px 0 rgba(167,139,250,0.15)",
            accent_bar_position="top",
            accent_bar_width="2px",
        ),
        spacing=ThemeSpacing(
            slide_padding="80px",
            element_gap="28px",
            bullet_gap="16px",
        ),
        decorations=ThemeDecorations(
            bullet_style="square",
            bullet_size="8px",
            quote_style="accent-bar",
            section_divider="gradient",
        ),
        layout=ThemeLayout(
            title_alignment="center",
            content_alignment="left",
            vertical_position="center",
        ),
    ),
    # -------------------------------------------------------------------------
    # MAGAZINE - Editorial elegance with serif typography
    # -------------------------------------------------------------------------
    "magazine": Theme(
        name=ThemeName.MAGAZINE,
        display_name="Magazine",
        description="Editorial elegance with serif typography and asymmetric layouts",
        colors=ThemeColors(
            background="#faf9f7",
            surface="#ffffff",
            text_primary="#1a1a1a",
            text_secondary="#666666",
            accent="#c41e3a",
            accent_hover="#9a1830",
            accent_light="#fce8ec",
            border="#e8e6e3",
            border_dark="#1a1a1a",
        ),
        typography=ThemeTypography(
            heading_font="Playfair Display, Georgia, serif",
            body_font="Source Serif Pro, Georgia, serif",
            google_fonts=[
                "Playfair+Display:wght@400;500;600;700;800",
                "Source+Serif+Pro:wght@400;600",
            ],
            title_size="7xl",
            title_weight=700,
            title_letter_spacing="-0.03em",
            title_line_height=1.0,
            heading_size="4xl",
            heading_weight=600,
            body_size="lg",
            body_line_height=1.8,
            quote_size="4xl",
            quote_style="italic",
        ),
        style=ThemeStyle(
            border_width="1px",
            border_style="solid",
            border_radius="0px",
            shadow=None,
            accent_bar_position="left",
            accent_bar_width="3px",
        ),
        spacing=ThemeSpacing(
            slide_padding="100px",
            element_gap="32px",
            bullet_gap="16px",
            content_max_width="75%",
        ),
        decorations=ThemeDecorations(
            bullet_style="dash",
            bullet_size="20px",
            quote_style="accent-bar",
            section_divider="line",
        ),
        layout=ThemeLayout(
            title_alignment="left",
            content_alignment="left",
            vertical_position="center",
        ),
    ),
    # -------------------------------------------------------------------------
    # TERMINAL - Hacker aesthetic with monospace and glow
    # -------------------------------------------------------------------------
    "terminal": Theme(
        name=ThemeName.TERMINAL,
        display_name="Terminal",
        description="Hacker aesthetic with monospace fonts and green glow effects",
        colors=ThemeColors(
            background="#0a0a0a",
            surface="#111111",
            text_primary="#00ff00",
            text_secondary="#008800",
            accent="#00ff00",
            accent_hover="#00cc00",
            accent_light="#003300",
            border="#1a1a1a",
            border_dark="#00ff00",
        ),
        typography=ThemeTypography(
            heading_font="JetBrains Mono, Consolas, monospace",
            body_font="JetBrains Mono, Consolas, monospace",
            google_fonts=["JetBrains+Mono:wght@400;500;700"],
            title_size="5xl",
            title_weight=700,
            title_letter_spacing="0",
            title_transform="uppercase",
            heading_size="3xl",
            heading_weight=500,
            body_size="lg",
            body_line_height=1.7,
            quote_style="normal",
        ),
        style=ThemeStyle(
            border_width="1px",
            border_style="solid",
            border_radius="0px",
            shadow="0 0 8px 0 rgba(0,255,0,0.3)",
            accent_bar_position="left",
            accent_bar_width="2px",
            background_pattern="scanlines",
            pattern_opacity=0.03,
        ),
        spacing=ThemeSpacing(
            slide_padding="60px",
            element_gap="24px",
            bullet_gap="12px",
        ),
        decorations=ThemeDecorations(
            bullet_style="arrow",
            bullet_size="16px",
            quote_style="none",
            section_divider="line",
        ),
        layout=ThemeLayout(
            title_alignment="left",
            content_alignment="left",
            vertical_position="top",
        ),
    ),
    # -------------------------------------------------------------------------
    # PLAYFUL - Rounded, colorful, bouncy style
    # -------------------------------------------------------------------------
    "playful": Theme(
        name=ThemeName.PLAYFUL,
        display_name="Playful",
        description="Fun, colorful style with rounded shapes and bouncy typography",
        colors=ThemeColors(
            background="#fff5eb",
            surface="#ffffff",
            text_primary="#2d1b69",
            text_secondary="#6b5b95",
            accent="#ff6b6b",
            accent_hover="#ee5a5a",
            accent_light="#ffe0e0",
            border="#e0d4f7",
            border_dark="#2d1b69",
        ),
        typography=ThemeTypography(
            heading_font="Nunito, system-ui, sans-serif",
            body_font="Nunito, system-ui, sans-serif",
            google_fonts=["Nunito:wght@400;600;700;800;900"],
            title_size="6xl",
            title_weight=900,
            title_letter_spacing="-0.01em",
            heading_size="4xl",
            heading_weight=800,
            body_weight=600,
            body_line_height=1.6,
            quote_style="normal",
        ),
        style=ThemeStyle(
            border_width="3px",
            border_style="solid",
            border_radius="24px",
            shadow="6px 6px 0px 0px",
            accent_bar_position="none",
            background_pattern="dots",
            pattern_opacity=0.08,
        ),
        spacing=ThemeSpacing(
            slide_padding="72px",
            element_gap="28px",
            bullet_gap="20px",
        ),
        decorations=ThemeDecorations(
            bullet_style="check",
            bullet_size="20px",
            quote_style="icon",
            section_divider="accent-block",
        ),
        layout=ThemeLayout(
            title_alignment="center",
            content_alignment="center",
            vertical_position="center",
        ),
    ),
}

DEFAULT_THEME = "neobrutalism"


def get_theme(name: str) -> Theme:
    """Get theme by name, falling back to default."""
    return THEMES.get(name, THEMES[DEFAULT_THEME])


def get_available_themes() -> list[dict]:
    """Get list of available themes for API response with full configuration."""
    return [theme_to_dict(theme) for theme in THEMES.values()]


def theme_to_dict(theme: Theme) -> dict:
    """Convert a Theme to a dictionary for API responses."""
    return {
        "name": theme.name.value,
        "display_name": theme.display_name,
        "description": theme.description,
        "colors": {
            "background": theme.colors.background,
            "surface": theme.colors.surface,
            "text_primary": theme.colors.text_primary,
            "text_secondary": theme.colors.text_secondary,
            "accent": theme.colors.accent,
            "accent_hover": theme.colors.accent_hover,
            "accent_light": theme.colors.accent_light,
            "border": theme.colors.border,
            "border_dark": theme.colors.border_dark,
        },
        "typography": {
            "heading_font": theme.typography.heading_font,
            "body_font": theme.typography.body_font,
            "google_fonts": theme.typography.google_fonts,
            "title_size": theme.typography.title_size,
            "title_weight": theme.typography.title_weight,
            "title_letter_spacing": theme.typography.title_letter_spacing,
            "title_transform": theme.typography.title_transform,
            "title_line_height": theme.typography.title_line_height,
            "heading_size": theme.typography.heading_size,
            "heading_weight": theme.typography.heading_weight,
            "heading_letter_spacing": theme.typography.heading_letter_spacing,
            "body_size": theme.typography.body_size,
            "body_weight": theme.typography.body_weight,
            "body_line_height": theme.typography.body_line_height,
            "quote_size": theme.typography.quote_size,
            "quote_style": theme.typography.quote_style,
        },
        "style": {
            "border_width": theme.style.border_width,
            "border_style": theme.style.border_style,
            "border_radius": theme.style.border_radius,
            "shadow": theme.style.shadow,
            "accent_bar_position": theme.style.accent_bar_position,
            "accent_bar_width": theme.style.accent_bar_width,
            "background_pattern": theme.style.background_pattern,
            "pattern_opacity": theme.style.pattern_opacity,
        },
        "spacing": {
            "slide_padding": theme.spacing.slide_padding,
            "element_gap": theme.spacing.element_gap,
            "bullet_gap": theme.spacing.bullet_gap,
            "content_max_width": theme.spacing.content_max_width,
        },
        "decorations": {
            "bullet_style": theme.decorations.bullet_style,
            "bullet_size": theme.decorations.bullet_size,
            "quote_style": theme.decorations.quote_style,
            "section_divider": theme.decorations.section_divider,
        },
        "layout": {
            "title_alignment": theme.layout.title_alignment,
            "content_alignment": theme.layout.content_alignment,
            "vertical_position": theme.layout.vertical_position,
        },
    }
