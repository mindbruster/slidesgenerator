/**
 * Slide and Presentation types
 * Mirrors backend Pydantic schemas
 */

export type SlideType = "title" | "content" | "bullets" | "quote" | "section" | "chart";
export type SlideLayout = "left" | "center" | "right" | "split";
export type ChartType = "bar" | "line" | "pie" | "donut" | "area" | "horizontal_bar";
export type ThemeName = "neobrutalism" | "corporate" | "minimal" | "dark";

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

export interface ThemeDefinition {
  name: ThemeName;
  display_name: string;
  description: string;
  colors: ThemeColors;
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
