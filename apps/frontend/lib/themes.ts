/**
 * Theme definitions for Decksnap presentations
 * Mirrors backend theme definitions for client-side use
 */

import type { ThemeDefinition, ThemeName } from "./types/slide";

export const THEMES: Record<ThemeName, ThemeDefinition> = {
  neobrutalism: {
    name: "neobrutalism",
    display_name: "Neobrutalism",
    description: "Bold, playful style with offset shadows and pink accents",
    colors: {
      background: "#f4f4f0",
      surface: "#ffffff",
      text_primary: "#0f0f0f",
      text_secondary: "#6b6b6b",
      accent: "#ff90e8",
      accent_hover: "#ff6bdf",
      accent_light: "#ffd6f5",
      border: "#e5e5e5",
      border_dark: "#0f0f0f",
    },
  },
  corporate: {
    name: "corporate",
    display_name: "Corporate",
    description: "Clean, professional look with blue accents",
    colors: {
      background: "#ffffff",
      surface: "#f8fafc",
      text_primary: "#1e293b",
      text_secondary: "#64748b",
      accent: "#2563eb",
      accent_hover: "#1d4ed8",
      accent_light: "#dbeafe",
      border: "#e2e8f0",
      border_dark: "#1e293b",
    },
  },
  minimal: {
    name: "minimal",
    display_name: "Minimal",
    description: "Ultra-clean with subtle grays and no distractions",
    colors: {
      background: "#ffffff",
      surface: "#fafafa",
      text_primary: "#18181b",
      text_secondary: "#71717a",
      accent: "#18181b",
      accent_hover: "#09090b",
      accent_light: "#f4f4f5",
      border: "#e4e4e7",
      border_dark: "#18181b",
    },
  },
  dark: {
    name: "dark",
    display_name: "Dark",
    description: "Modern dark mode with purple accents",
    colors: {
      background: "#0f0f0f",
      surface: "#1a1a1a",
      text_primary: "#f4f4f5",
      text_secondary: "#a1a1aa",
      accent: "#a78bfa",
      accent_hover: "#8b5cf6",
      accent_light: "#2e1065",
      border: "#27272a",
      border_dark: "#3f3f46",
    },
  },
};

export const DEFAULT_THEME: ThemeName = "neobrutalism";

export const THEME_LIST = Object.values(THEMES);
