"""
Theme definitions for Decksnap presentations.
Centralized color and styling configuration shared across backend services.
"""

from dataclasses import dataclass
from enum import Enum


class ThemeName(str, Enum):
    """Available theme names."""

    NEOBRUTALISM = "neobrutalism"
    CORPORATE = "corporate"
    MINIMAL = "minimal"
    DARK = "dark"


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


@dataclass(frozen=True)
class Theme:
    """Complete theme definition."""

    name: ThemeName
    display_name: str
    description: str
    colors: ThemeColors


# Theme Definitions
THEMES: dict[str, Theme] = {
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
    ),
    "corporate": Theme(
        name=ThemeName.CORPORATE,
        display_name="Corporate",
        description="Clean, professional look with blue accents",
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
    ),
    "minimal": Theme(
        name=ThemeName.MINIMAL,
        display_name="Minimal",
        description="Ultra-clean with subtle grays and no distractions",
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
    ),
    "dark": Theme(
        name=ThemeName.DARK,
        display_name="Dark",
        description="Modern dark mode with purple accents",
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
    ),
}

DEFAULT_THEME = "neobrutalism"


def get_theme(name: str) -> Theme:
    """Get theme by name, falling back to default."""
    return THEMES.get(name, THEMES[DEFAULT_THEME])


def get_available_themes() -> list[dict]:
    """Get list of available themes for API response."""
    return [
        {
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
        }
        for theme in THEMES.values()
    ]
