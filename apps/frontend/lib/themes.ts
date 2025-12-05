/**
 * Theme definitions for Decksnap presentations
 * Mirrors backend theme definitions for client-side use
 *
 * Each theme provides complete control over:
 * - Colors: Full color palette with accent variations
 * - Typography: Font families, sizes, weights, and styling
 * - Style: Borders, shadows, patterns, and decorations
 * - Spacing: Padding, gaps, and margins
 * - Layout: Alignment and positioning defaults
 */

import type { ThemeDefinition, ThemeName } from './types/slide';

export const THEMES: Record<ThemeName, ThemeDefinition> = {
  // ===========================================================================
  // NEOBRUTALISM - Bold, playful style with offset shadows
  // ===========================================================================
  neobrutalism: {
    name: 'neobrutalism',
    display_name: 'Neobrutalism',
    description: 'Bold, playful style with offset shadows and pink accents',
    colors: {
      background: '#f4f4f0',
      surface: '#ffffff',
      text_primary: '#0f0f0f',
      text_secondary: '#6b6b6b',
      accent: '#ff90e8',
      accent_hover: '#ff6bdf',
      accent_light: '#ffd6f5',
      border: '#e5e5e5',
      border_dark: '#0f0f0f',
    },
    typography: {
      heading_font: 'system-ui, -apple-system, sans-serif',
      body_font: 'system-ui, -apple-system, sans-serif',
      google_fonts: [],
      title_size: '6xl',
      title_weight: 800,
      title_letter_spacing: '-0.02em',
      title_transform: 'none',
      title_line_height: 1.1,
      heading_size: '4xl',
      heading_weight: 700,
      heading_letter_spacing: '-0.01em',
      body_size: 'xl',
      body_weight: 400,
      body_line_height: 1.6,
      quote_size: '3xl',
      quote_style: 'italic',
    },
    style: {
      border_width: '2px',
      border_style: 'solid',
      border_radius: '16px',
      shadow: '4px 4px 0px 0px',
      accent_bar_position: 'top',
      accent_bar_width: '4px',
      background_pattern: 'none',
      pattern_opacity: 0.05,
      background_gradient: null,
    },
    spacing: {
      slide_padding: '80px',
      element_gap: '24px',
      bullet_gap: '16px',
      content_max_width: '100%',
    },
    decorations: {
      bullet_style: 'disc',
      bullet_size: '10px',
      quote_style: 'large-mark',
      section_divider: 'accent-block',
    },
    layout: {
      title_alignment: 'center',
      content_alignment: 'left',
      vertical_position: 'center',
    },
  },

  // ===========================================================================
  // CORPORATE - Clean, professional with numbered lists
  // ===========================================================================
  corporate: {
    name: 'corporate',
    display_name: 'Corporate',
    description: 'Clean, professional look with blue accents and numbered lists',
    colors: {
      background: '#ffffff',
      surface: '#f8fafc',
      text_primary: '#1e293b',
      text_secondary: '#64748b',
      accent: '#2563eb',
      accent_hover: '#1d4ed8',
      accent_light: '#dbeafe',
      border: '#e2e8f0',
      border_dark: '#1e293b',
    },
    typography: {
      heading_font: 'Inter, system-ui, sans-serif',
      body_font: 'Inter, system-ui, sans-serif',
      google_fonts: ['Inter:wght@400;500;600;700'],
      title_size: '5xl',
      title_weight: 600,
      title_letter_spacing: '-0.01em',
      title_transform: 'none',
      title_line_height: 1.1,
      heading_size: '3xl',
      heading_weight: 600,
      heading_letter_spacing: '-0.01em',
      body_size: 'xl',
      body_weight: 400,
      body_line_height: 1.7,
      quote_size: '3xl',
      quote_style: 'italic',
    },
    style: {
      border_width: '1px',
      border_style: 'solid',
      border_radius: '8px',
      shadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
      accent_bar_position: 'left',
      accent_bar_width: '3px',
      background_pattern: 'none',
      pattern_opacity: 0.05,
      background_gradient: 'linear-gradient(135deg, #ffffff 0%, #f0f4ff 100%)',
    },
    spacing: {
      slide_padding: '96px',
      element_gap: '32px',
      bullet_gap: '12px',
      content_max_width: '100%',
    },
    decorations: {
      bullet_style: 'number',
      bullet_size: '24px',
      quote_style: 'accent-bar',
      section_divider: 'line',
    },
    layout: {
      title_alignment: 'left',
      content_alignment: 'left',
      vertical_position: 'center',
    },
  },

  // ===========================================================================
  // MINIMAL - Ultra-clean with thin typography
  // ===========================================================================
  minimal: {
    name: 'minimal',
    display_name: 'Minimal',
    description: 'Ultra-clean with thin typography and maximum whitespace',
    colors: {
      background: '#ffffff',
      surface: '#fafafa',
      text_primary: '#18181b',
      text_secondary: '#71717a',
      accent: '#18181b',
      accent_hover: '#09090b',
      accent_light: '#f4f4f5',
      border: '#e4e4e7',
      border_dark: '#18181b',
    },
    typography: {
      heading_font: 'Inter, system-ui, sans-serif',
      body_font: 'Inter, system-ui, sans-serif',
      google_fonts: ['Inter:wght@300;400;500;600'],
      title_size: '5xl',
      title_weight: 500,
      title_letter_spacing: '-0.02em',
      title_transform: 'none',
      title_line_height: 1.1,
      heading_size: '3xl',
      heading_weight: 500,
      heading_letter_spacing: '-0.01em',
      body_size: 'xl',
      body_weight: 300,
      body_line_height: 1.8,
      quote_size: '3xl',
      quote_style: 'normal',
    },
    style: {
      border_width: '1px',
      border_style: 'solid',
      border_radius: '4px',
      shadow: null,
      accent_bar_position: 'none',
      accent_bar_width: '4px',
      background_pattern: 'none',
      pattern_opacity: 0.05,
      background_gradient: null,
    },
    spacing: {
      slide_padding: '100px',
      element_gap: '40px',
      bullet_gap: '20px',
      content_max_width: '80%',
    },
    decorations: {
      bullet_style: 'dash',
      bullet_size: '16px',
      quote_style: 'none',
      section_divider: 'none',
    },
    layout: {
      title_alignment: 'left',
      content_alignment: 'left',
      vertical_position: 'center',
    },
  },

  // ===========================================================================
  // DARK - Modern dark mode with glow effects
  // ===========================================================================
  dark: {
    name: 'dark',
    display_name: 'Dark',
    description: 'Modern dark mode with purple accents and subtle glow',
    colors: {
      background: '#0f0f0f',
      surface: '#1a1a1a',
      text_primary: '#f4f4f5',
      text_secondary: '#a1a1aa',
      accent: '#a78bfa',
      accent_hover: '#8b5cf6',
      accent_light: '#2e1065',
      border: '#27272a',
      border_dark: '#3f3f46',
    },
    typography: {
      heading_font: 'Inter, system-ui, sans-serif',
      body_font: 'Inter, system-ui, sans-serif',
      google_fonts: ['Inter:wght@400;500;600;700'],
      title_size: '6xl',
      title_weight: 700,
      title_letter_spacing: '-0.02em',
      title_transform: 'none',
      title_line_height: 1.1,
      heading_size: '4xl',
      heading_weight: 600,
      heading_letter_spacing: '-0.01em',
      body_size: 'xl',
      body_weight: 400,
      body_line_height: 1.6,
      quote_size: '3xl',
      quote_style: 'italic',
    },
    style: {
      border_width: '1px',
      border_style: 'solid',
      border_radius: '12px',
      shadow: '0 0 20px 0 rgba(167,139,250,0.15)',
      accent_bar_position: 'top',
      accent_bar_width: '2px',
      background_pattern: 'none',
      pattern_opacity: 0.05,
      background_gradient: 'linear-gradient(145deg, #0f0f0f 0%, #1a1a2e 50%, #16213e 100%)',
    },
    spacing: {
      slide_padding: '80px',
      element_gap: '28px',
      bullet_gap: '16px',
      content_max_width: '100%',
    },
    decorations: {
      bullet_style: 'square',
      bullet_size: '8px',
      quote_style: 'accent-bar',
      section_divider: 'gradient',
    },
    layout: {
      title_alignment: 'center',
      content_alignment: 'left',
      vertical_position: 'center',
    },
  },

  // ===========================================================================
  // MAGAZINE - Editorial elegance with serif typography
  // ===========================================================================
  magazine: {
    name: 'magazine',
    display_name: 'Magazine',
    description: 'Editorial elegance with serif typography and asymmetric layouts',
    colors: {
      background: '#faf9f7',
      surface: '#ffffff',
      text_primary: '#1a1a1a',
      text_secondary: '#666666',
      accent: '#c41e3a',
      accent_hover: '#9a1830',
      accent_light: '#fce8ec',
      border: '#e8e6e3',
      border_dark: '#1a1a1a',
    },
    typography: {
      heading_font: 'Playfair Display, Georgia, serif',
      body_font: 'Source Serif Pro, Georgia, serif',
      google_fonts: [
        'Playfair+Display:wght@400;500;600;700;800',
        'Source+Serif+Pro:wght@400;600',
      ],
      title_size: '7xl',
      title_weight: 700,
      title_letter_spacing: '-0.03em',
      title_transform: 'none',
      title_line_height: 1.0,
      heading_size: '4xl',
      heading_weight: 600,
      heading_letter_spacing: '-0.01em',
      body_size: 'lg',
      body_weight: 400,
      body_line_height: 1.8,
      quote_size: '4xl',
      quote_style: 'italic',
    },
    style: {
      border_width: '1px',
      border_style: 'solid',
      border_radius: '0px',
      shadow: null,
      accent_bar_position: 'left',
      accent_bar_width: '3px',
      background_pattern: 'none',
      pattern_opacity: 0.05,
      background_gradient: 'linear-gradient(180deg, #faf9f7 0%, #f5f0eb 100%)',
    },
    spacing: {
      slide_padding: '100px',
      element_gap: '32px',
      bullet_gap: '16px',
      content_max_width: '75%',
    },
    decorations: {
      bullet_style: 'dash',
      bullet_size: '20px',
      quote_style: 'accent-bar',
      section_divider: 'line',
    },
    layout: {
      title_alignment: 'left',
      content_alignment: 'left',
      vertical_position: 'center',
    },
  },

  // ===========================================================================
  // TERMINAL - Hacker aesthetic with monospace and glow
  // ===========================================================================
  terminal: {
    name: 'terminal',
    display_name: 'Terminal',
    description: 'Hacker aesthetic with monospace fonts and green glow effects',
    colors: {
      background: '#0a0a0a',
      surface: '#111111',
      text_primary: '#00ff00',
      text_secondary: '#008800',
      accent: '#00ff00',
      accent_hover: '#00cc00',
      accent_light: '#003300',
      border: '#1a1a1a',
      border_dark: '#00ff00',
    },
    typography: {
      heading_font: 'JetBrains Mono, Consolas, monospace',
      body_font: 'JetBrains Mono, Consolas, monospace',
      google_fonts: ['JetBrains+Mono:wght@400;500;700'],
      title_size: '5xl',
      title_weight: 700,
      title_letter_spacing: '0',
      title_transform: 'uppercase',
      title_line_height: 1.1,
      heading_size: '3xl',
      heading_weight: 500,
      heading_letter_spacing: '-0.01em',
      body_size: 'lg',
      body_weight: 400,
      body_line_height: 1.7,
      quote_size: '3xl',
      quote_style: 'normal',
    },
    style: {
      border_width: '1px',
      border_style: 'solid',
      border_radius: '0px',
      shadow: '0 0 8px 0 rgba(0,255,0,0.3)',
      accent_bar_position: 'left',
      accent_bar_width: '2px',
      background_pattern: 'scanlines',
      pattern_opacity: 0.03,
      background_gradient: 'radial-gradient(ellipse at bottom right, #001a00 0%, #0a0a0a 70%)',
    },
    spacing: {
      slide_padding: '60px',
      element_gap: '24px',
      bullet_gap: '12px',
      content_max_width: '100%',
    },
    decorations: {
      bullet_style: 'arrow',
      bullet_size: '16px',
      quote_style: 'none',
      section_divider: 'line',
    },
    layout: {
      title_alignment: 'left',
      content_alignment: 'left',
      vertical_position: 'top',
    },
  },

  // ===========================================================================
  // PLAYFUL - Rounded, colorful, bouncy style
  // ===========================================================================
  playful: {
    name: 'playful',
    display_name: 'Playful',
    description: 'Fun, colorful style with rounded shapes and bouncy typography',
    colors: {
      background: '#fff5eb',
      surface: '#ffffff',
      text_primary: '#2d1b69',
      text_secondary: '#6b5b95',
      accent: '#ff6b6b',
      accent_hover: '#ee5a5a',
      accent_light: '#ffe0e0',
      border: '#e0d4f7',
      border_dark: '#2d1b69',
    },
    typography: {
      heading_font: 'Nunito, system-ui, sans-serif',
      body_font: 'Nunito, system-ui, sans-serif',
      google_fonts: ['Nunito:wght@400;600;700;800;900'],
      title_size: '6xl',
      title_weight: 900,
      title_letter_spacing: '-0.01em',
      title_transform: 'none',
      title_line_height: 1.1,
      heading_size: '4xl',
      heading_weight: 800,
      heading_letter_spacing: '-0.01em',
      body_size: 'xl',
      body_weight: 600,
      body_line_height: 1.6,
      quote_size: '3xl',
      quote_style: 'normal',
    },
    style: {
      border_width: '3px',
      border_style: 'solid',
      border_radius: '24px',
      shadow: '6px 6px 0px 0px',
      accent_bar_position: 'none',
      accent_bar_width: '4px',
      background_pattern: 'dots',
      pattern_opacity: 0.08,
      background_gradient: 'linear-gradient(135deg, #fff5eb 0%, #ffe0f3 50%, #e0f0ff 100%)',
    },
    spacing: {
      slide_padding: '72px',
      element_gap: '28px',
      bullet_gap: '20px',
      content_max_width: '100%',
    },
    decorations: {
      bullet_style: 'check',
      bullet_size: '20px',
      quote_style: 'icon',
      section_divider: 'accent-block',
    },
    layout: {
      title_alignment: 'center',
      content_alignment: 'center',
      vertical_position: 'center',
    },
  },

  // ===========================================================================
  // AI - Futuristic tech style with cyan accents and glow effects
  // ===========================================================================
  ai: {
    name: 'ai',
    display_name: 'AI',
    description: 'Futuristic tech style with cyan accents, dark backgrounds, and robotic imagery',
    colors: {
      background: '#0a0e1a',
      surface: '#121829',
      text_primary: '#e0f2fe',
      text_secondary: '#7dd3fc',
      accent: '#00d4ff',
      accent_hover: '#00b8e6',
      accent_light: '#0c2d4d',
      border: '#1e3a5f',
      border_dark: '#00d4ff',
    },
    typography: {
      heading_font: 'Orbitron, Inter, system-ui, sans-serif',
      body_font: 'Inter, system-ui, sans-serif',
      google_fonts: ['Orbitron:wght@400;500;600;700;800;900', 'Inter:wght@400;500;600'],
      title_size: '6xl',
      title_weight: 700,
      title_letter_spacing: '0.05em',
      title_transform: 'uppercase',
      title_line_height: 1.1,
      heading_size: '4xl',
      heading_weight: 600,
      heading_letter_spacing: '0.02em',
      body_size: 'xl',
      body_weight: 400,
      body_line_height: 1.7,
      quote_size: '3xl',
      quote_style: 'normal',
    },
    style: {
      border_width: '1px',
      border_style: 'solid',
      border_radius: '8px',
      shadow: '0 0 30px 0 rgba(0,212,255,0.2)',
      accent_bar_position: 'top',
      accent_bar_width: '2px',
      background_pattern: 'grid',
      pattern_opacity: 0.05,
      background_gradient: 'linear-gradient(135deg, #0a0e1a 0%, #0f172a 50%, #1e1b4b 100%)',
    },
    spacing: {
      slide_padding: '80px',
      element_gap: '28px',
      bullet_gap: '16px',
      content_max_width: '100%',
    },
    decorations: {
      bullet_style: 'arrow',
      bullet_size: '12px',
      quote_style: 'accent-bar',
      section_divider: 'gradient',
    },
    layout: {
      title_alignment: 'center',
      content_alignment: 'left',
      vertical_position: 'center',
    },
  },

  // ===========================================================================
  // OCEAN - Fresh aquatic theme with blue/teal gradient
  // ===========================================================================
  ocean: {
    name: 'ocean',
    display_name: 'Ocean',
    description: 'Fresh aquatic theme with blue and teal gradients',
    colors: {
      background: '#e0f7fa',
      surface: '#ffffff',
      text_primary: '#004d61',
      text_secondary: '#00796b',
      accent: '#00bcd4',
      accent_hover: '#0097a7',
      accent_light: '#b2ebf2',
      border: '#80deea',
      border_dark: '#004d61',
    },
    typography: {
      heading_font: 'Poppins, system-ui, sans-serif',
      body_font: 'Poppins, system-ui, sans-serif',
      google_fonts: ['Poppins:wght@400;500;600;700;800'],
      title_size: '6xl',
      title_weight: 700,
      title_letter_spacing: '-0.02em',
      title_transform: 'none',
      title_line_height: 1.1,
      heading_size: '4xl',
      heading_weight: 600,
      heading_letter_spacing: '-0.01em',
      body_size: 'xl',
      body_weight: 400,
      body_line_height: 1.6,
      quote_size: '3xl',
      quote_style: 'italic',
    },
    style: {
      border_width: '2px',
      border_style: 'solid',
      border_radius: '20px',
      shadow: '5px 5px 0px 0px',
      accent_bar_position: 'bottom',
      accent_bar_width: '5px',
      background_pattern: 'none',
      pattern_opacity: 0.05,
      background_gradient: 'linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 50%, #80deea 100%)',
    },
    spacing: {
      slide_padding: '80px',
      element_gap: '28px',
      bullet_gap: '16px',
      content_max_width: '100%',
    },
    decorations: {
      bullet_style: 'disc',
      bullet_size: '12px',
      quote_style: 'large-mark',
      section_divider: 'accent-block',
    },
    layout: {
      title_alignment: 'center',
      content_alignment: 'left',
      vertical_position: 'center',
    },
  },

  // ===========================================================================
  // SUNSET - Warm orange and purple gradient theme
  // ===========================================================================
  sunset: {
    name: 'sunset',
    display_name: 'Sunset',
    description: 'Warm sunset colors with orange and purple gradients',
    colors: {
      background: '#fff4e6',
      surface: '#ffffff',
      text_primary: '#4a1942',
      text_secondary: '#7b2d26',
      accent: '#ff6f00',
      accent_hover: '#e65100',
      accent_light: '#ffe0b2',
      border: '#ffb74d',
      border_dark: '#4a1942',
    },
    typography: {
      heading_font: 'Montserrat, system-ui, sans-serif',
      body_font: 'Open Sans, system-ui, sans-serif',
      google_fonts: ['Montserrat:wght@400;600;700;800', 'Open+Sans:wght@400;600'],
      title_size: '6xl',
      title_weight: 800,
      title_letter_spacing: '-0.02em',
      title_transform: 'none',
      title_line_height: 1.1,
      heading_size: '4xl',
      heading_weight: 700,
      heading_letter_spacing: '-0.01em',
      body_size: 'xl',
      body_weight: 400,
      body_line_height: 1.6,
      quote_size: '3xl',
      quote_style: 'italic',
    },
    style: {
      border_width: '2px',
      border_style: 'solid',
      border_radius: '16px',
      shadow: '4px 4px 0px 0px',
      accent_bar_position: 'left',
      accent_bar_width: '6px',
      background_pattern: 'none',
      pattern_opacity: 0.05,
      background_gradient: 'linear-gradient(135deg, #fff4e6 0%, #ffe0b2 30%, #ffb74d 60%, #ce93d8 100%)',
    },
    spacing: {
      slide_padding: '80px',
      element_gap: '28px',
      bullet_gap: '16px',
      content_max_width: '100%',
    },
    decorations: {
      bullet_style: 'disc',
      bullet_size: '12px',
      quote_style: 'large-mark',
      section_divider: 'accent-block',
    },
    layout: {
      title_alignment: 'left',
      content_alignment: 'left',
      vertical_position: 'center',
    },
  },

  // ===========================================================================
  // FOREST - Natural green theme with earthy tones
  // ===========================================================================
  forest: {
    name: 'forest',
    display_name: 'Forest',
    description: 'Natural green theme with fresh, earthy tones',
    colors: {
      background: '#e8f5e9',
      surface: '#ffffff',
      text_primary: '#1b5e20',
      text_secondary: '#388e3c',
      accent: '#4caf50',
      accent_hover: '#388e3c',
      accent_light: '#c8e6c9',
      border: '#81c784',
      border_dark: '#1b5e20',
    },
    typography: {
      heading_font: 'Raleway, system-ui, sans-serif',
      body_font: 'Lato, system-ui, sans-serif',
      google_fonts: ['Raleway:wght@400;600;700;800', 'Lato:wght@400;700'],
      title_size: '6xl',
      title_weight: 700,
      title_letter_spacing: '-0.02em',
      title_transform: 'none',
      title_line_height: 1.1,
      heading_size: '4xl',
      heading_weight: 600,
      heading_letter_spacing: '-0.01em',
      body_size: 'xl',
      body_weight: 400,
      body_line_height: 1.7,
      quote_size: '3xl',
      quote_style: 'italic',
    },
    style: {
      border_width: '2px',
      border_style: 'solid',
      border_radius: '12px',
      shadow: '3px 3px 0px 0px',
      accent_bar_position: 'top',
      accent_bar_width: '4px',
      background_pattern: 'none',
      pattern_opacity: 0.05,
      background_gradient: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 50%, #a5d6a7 100%)',
    },
    spacing: {
      slide_padding: '90px',
      element_gap: '30px',
      bullet_gap: '18px',
      content_max_width: '100%',
    },
    decorations: {
      bullet_style: 'check',
      bullet_size: '14px',
      quote_style: 'accent-bar',
      section_divider: 'line',
    },
    layout: {
      title_alignment: 'center',
      content_alignment: 'left',
      vertical_position: 'center',
    },
  },

  // ===========================================================================
  // LAVENDER - Soft purple and pink theme with elegant feel
  // ===========================================================================
  lavender: {
    name: 'lavender',
    display_name: 'Lavender',
    description: 'Soft lavender theme with elegant purple and pink tones',
    colors: {
      background: '#f3e5f5',
      surface: '#ffffff',
      text_primary: '#4a148c',
      text_secondary: '#7b1fa2',
      accent: '#9c27b0',
      accent_hover: '#7b1fa2',
      accent_light: '#e1bee7',
      border: '#ce93d8',
      border_dark: '#4a148c',
    },
    typography: {
      heading_font: 'Quicksand, system-ui, sans-serif',
      body_font: 'Quicksand, system-ui, sans-serif',
      google_fonts: ['Quicksand:wght@400;500;600;700'],
      title_size: '6xl',
      title_weight: 700,
      title_letter_spacing: '-0.01em',
      title_transform: 'none',
      title_line_height: 1.1,
      heading_size: '4xl',
      heading_weight: 600,
      heading_letter_spacing: '-0.01em',
      body_size: 'xl',
      body_weight: 500,
      body_line_height: 1.6,
      quote_size: '3xl',
      quote_style: 'italic',
    },
    style: {
      border_width: '2px',
      border_style: 'solid',
      border_radius: '18px',
      shadow: '4px 4px 0px 0px',
      accent_bar_position: 'none',
      accent_bar_width: '4px',
      background_pattern: 'dots',
      pattern_opacity: 0.06,
      background_gradient: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 50%, #ce93d8 100%)',
    },
    spacing: {
      slide_padding: '85px',
      element_gap: '26px',
      bullet_gap: '16px',
      content_max_width: '100%',
    },
    decorations: {
      bullet_style: 'disc',
      bullet_size: '10px',
      quote_style: 'large-mark',
      section_divider: 'accent-block',
    },
    layout: {
      title_alignment: 'center',
      content_alignment: 'center',
      vertical_position: 'center',
    },
  },
};

export const DEFAULT_THEME: ThemeName = 'neobrutalism';

export const THEME_LIST = Object.values(THEMES);

/**
 * Get all unique Google Fonts URLs needed for all themes
 */
export function getGoogleFontsUrl(): string {
  const fonts = new Set<string>();

  Object.values(THEMES).forEach((theme) => {
    theme.typography.google_fonts.forEach((font) => fonts.add(font));
  });

  if (fonts.size === 0) return '';

  const fontParams = Array.from(fonts).join('&family=');
  return `https://fonts.googleapis.com/css2?family=${fontParams}&display=swap`;
}
