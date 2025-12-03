/**
 * Slide and Presentation types
 * Mirrors backend Pydantic schemas
 */

export type SlideType = "title" | "content" | "bullets" | "quote" | "section";
export type SlideLayout = "left" | "center" | "right" | "split";

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
}

export interface AgentEvent {
  type: "thinking" | "tool_call" | "tool_result" | "complete" | "error";
  message?: string;
  tool?: string;
  args?: Record<string, unknown>;
  slide_number?: number;
  result?: string;
  success?: boolean;
  presentation_id?: number;
  title?: string;
  slide_count?: number;
  presentation?: Presentation;
}
