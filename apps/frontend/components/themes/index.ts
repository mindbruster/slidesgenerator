/**
 * Theme Registry
 *
 * Central registry for all theme implementations.
 * Each theme provides a config and slide components.
 *
 * The component-based architecture allows themes to have completely
 * different rendering logic while maintaining a consistent API.
 */

import type { ThemeName } from '@/lib/types';
import { THEMES } from '@/lib/themes';
import type { ThemeRegistration, ThemeSlideComponents, SlideComponentProps } from './base/types';
import { neobrutalismTheme } from './neobrutalism';

// All themes use the base components that read from theme config
// This provides dramatic visual differences through configuration
// Themes can override specific components for unique rendering needs

const THEME_REGISTRY: Record<ThemeName, ThemeRegistration> = {
  neobrutalism: neobrutalismTheme,
  // Other themes use the same components with different configs
  // The components read all styling from the theme config
  corporate: {
    config: THEMES.corporate,
    components: neobrutalismTheme.components,
  },
  minimal: {
    config: THEMES.minimal,
    components: neobrutalismTheme.components,
  },
  dark: {
    config: THEMES.dark,
    components: neobrutalismTheme.components,
  },
  magazine: {
    config: THEMES.magazine,
    components: neobrutalismTheme.components,
  },
  terminal: {
    config: THEMES.terminal,
    components: neobrutalismTheme.components,
  },
  playful: {
    config: THEMES.playful,
    components: neobrutalismTheme.components,
  },
};

/**
 * Get theme components for a theme name
 */
export function getThemeComponents(theme: ThemeName): ThemeSlideComponents {
  return THEME_REGISTRY[theme]?.components ?? THEME_REGISTRY.neobrutalism.components;
}

/**
 * Get full theme registration (config + components)
 */
export function getThemeRegistration(theme: ThemeName): ThemeRegistration {
  return THEME_REGISTRY[theme] ?? THEME_REGISTRY.neobrutalism;
}

/**
 * Resolve slide component based on theme and slide type
 */
export function getSlideComponent(
  theme: ThemeName,
  slideType: string
): React.ComponentType<SlideComponentProps> {
  const components = getThemeComponents(theme);

  const componentMap: Record<string, React.ComponentType<SlideComponentProps>> = {
    title: components.TitleSlide,
    content: components.ContentSlide,
    bullets: components.BulletsSlide,
    quote: components.QuoteSlide,
    section: components.SectionSlide,
    chart: components.ChartSlide,
  };

  return componentMap[slideType] ?? components.ContentSlide;
}

// Re-export types
export type { ThemeRegistration, ThemeSlideComponents, SlideComponentProps };
