/**
 * Template types for the Template Library feature
 * Mirrors backend Pydantic schemas
 */

import type { SlideType, SlideLayout, ThemeName } from "./slide";

export type TemplateCategory =
  | "business"
  | "education"
  | "marketing"
  | "technology"
  | "creative"
  | "personal"
  | "healthcare"
  | "finance"
  | "sales"
  | "nonprofit";

export type DifficultyLevel = "beginner" | "intermediate" | "advanced";

export interface TemplateSlide {
  id: number;
  order: number;
  slide_type: SlideType;
  layout: SlideLayout;
  placeholder_title: string | null;
  placeholder_body: string | null;
  placeholder_bullets: string[] | null;
  ai_instructions: string | null;
  is_required: boolean;
}

export interface Template {
  id: number;
  name: string;
  description: string | null;
  category: TemplateCategory;
  theme: ThemeName;
  thumbnail_url: string | null;
  is_system: boolean;
  is_public: boolean;
  usage_count: number;
  slides: TemplateSlide[];
  tags: string[] | null;
  difficulty_level: DifficultyLevel;
  estimated_time: number;
  industry_tags: string[] | null;
  popularity_score: number;
}

export interface TemplateListItem {
  id: number;
  name: string;
  description: string | null;
  category: TemplateCategory;
  theme: ThemeName;
  thumbnail_url: string | null;
  is_system: boolean;
  usage_count: number;
  slide_count: number;
  tags: string[] | null;
  difficulty_level: DifficultyLevel;
  estimated_time: number;
  industry_tags: string[] | null;
  popularity_score: number;
}

export interface TemplateSlideCreate {
  order: number;
  slide_type: SlideType;
  layout?: SlideLayout;
  placeholder_title?: string;
  placeholder_body?: string;
  placeholder_bullets?: string[];
  ai_instructions?: string;
  is_required?: boolean;
}

export interface TemplateCreateRequest {
  name: string;
  description?: string;
  category: TemplateCategory;
  theme?: ThemeName;
  tags?: string[];
  is_public?: boolean;
  difficulty_level?: DifficultyLevel;
  estimated_time?: number;
  industry_tags?: string[];
  slides: TemplateSlideCreate[];
}

export interface TemplateUpdateRequest {
  name?: string;
  description?: string;
  category?: TemplateCategory;
  theme?: ThemeName;
  thumbnail_url?: string;
  tags?: string[];
  is_public?: boolean;
  difficulty_level?: DifficultyLevel;
  estimated_time?: number;
  industry_tags?: string[];
}

export interface TemplateGenerateRequest {
  user_content: string;
  theme?: ThemeName;
  variables?: Record<string, string>;
  excluded_slides?: number[];
}

export interface CategoryCount {
  category: TemplateCategory;
  count: number;
}
