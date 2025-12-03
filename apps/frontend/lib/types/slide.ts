/**
 * Slide and Presentation types
 * Mirrors backend Pydantic schemas
 */

export type SlideType = "title" | "content" | "bullets" | "quote" | "section" | "chart";
export type SlideLayout = "left" | "center" | "right" | "split";
export type ChartType = "bar" | "line" | "pie" | "donut" | "area" | "horizontal_bar";
export type ThemeName = "neobrutalism" | "corporate" | "minimal" | "dark" | "magazine" | "terminal" | "playful";

// =============================================================================
// THEME TYPE DEFINITIONS
// =============================================================================

export interface ThemeColors {
  background: string;
  surface: string;
  text_primary: string;
  text_secondary: string;
  accent: string;
  accent_hover: string;
  accent_light: string;
  border: string;
  border_dark: string;
}

export interface ThemeTypography {
  heading_font: string;
  body_font: string;
  google_fonts: string[];
  title_size: string;
  title_weight: number;
  title_letter_spacing: string;
  title_transform: "none" | "uppercase" | "lowercase" | "capitalize";
  title_line_height: number;
  heading_size: string;
  heading_weight: number;
  heading_letter_spacing: string;
  body_size: string;
  body_weight: number;
  body_line_height: number;
  quote_size: string;
  quote_style: "normal" | "italic";
}

export interface ThemeStyle {
  border_width: string;
  border_style: "solid" | "dashed" | "dotted" | "none";
  border_radius: string;
  shadow: string | null;
  accent_bar_position: "none" | "top" | "left" | "bottom";
  accent_bar_width: string;
  background_pattern: "none" | "dots" | "grid" | "scanlines" | "noise";
  pattern_opacity: number;
}

export interface ThemeSpacing {
  slide_padding: string;
  element_gap: string;
  bullet_gap: string;
  content_max_width: string;
}

export interface ThemeDecorations {
  bullet_style: "disc" | "dash" | "arrow" | "number" | "check" | "square";
  bullet_size: string;
  quote_style: "large-mark" | "accent-bar" | "icon" | "none";
  section_divider: "line" | "accent-block" | "gradient" | "none";
}

export interface ThemeLayout {
  title_alignment: "left" | "center" | "right";
  content_alignment: "left" | "center" | "right";
  vertical_position: "top" | "center" | "bottom";
}

export interface ThemeDefinition {
  name: ThemeName;
  display_name: string;
  description: string;
  colors: ThemeColors;
  typography: ThemeTypography;
  style: ThemeStyle;
  spacing: ThemeSpacing;
  decorations: ThemeDecorations;
  layout: ThemeLayout;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface ChartConfig {
  show_legend?: boolean;
  show_values?: boolean;
  y_axis_label?: string;
  x_axis_label?: string;
}

export interface Slide {
  id: number;
  type: SlideType;
  title?: string | null;
  subtitle?: string | null;
  body?: string | null;
  bullets?: string[] | null;
  quote?: string | null;
  attribution?: string | null;
  layout: SlideLayout;
  order: number;
  // Chart fields
  chart_type?: ChartType | null;
  chart_data?: ChartDataPoint[] | null;
  chart_config?: ChartConfig | null;
}

export interface Presentation {
  id: number;
  title: string;
  input_text: string;
  theme: string;
  slides: Slide[];
  created_at: string;
  updated_at: string;
}

export interface GenerateSlidesRequest {
  text: string;
  slide_count?: number;
  title?: string;
  theme?: ThemeName;
}

export interface GenerateSlidesResponse {
  presentation: Presentation;
}

export interface SlideUpdate {
  type?: SlideType;
  title?: string | null;
  subtitle?: string | null;
  body?: string | null;
  bullets?: string[] | null;
  quote?: string | null;
  attribution?: string | null;
  layout?: SlideLayout;
  // Chart fields
  chart_type?: ChartType | null;
  chart_data?: ChartDataPoint[] | null;
  chart_config?: ChartConfig | null;
}

export interface AgentEvent {
  type: "thinking" | "tool_call" | "tool_result" | "complete" | "error";
  message?: string;
  tool?: string;
  args?: Record<string, unknown>;
  slide_number?: number;
  slide?: Slide;
  result?: string;
  success?: boolean;
  presentation_id?: number;
  title?: string;
  slide_count?: number;
  iteration?: number;
  presentation?: Presentation;
}
