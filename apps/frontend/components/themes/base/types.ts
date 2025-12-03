/**
 * Base types for theme components
 *
 * All theme-specific slide components must implement these interfaces
 * to ensure consistency across different themes.
 */

import type {
  Slide,
  ChartDataPoint,
  ThemeName,
  ThemeDefinition,
} from '@/lib/types';

/**
 * Props passed to all slide components
 */
export interface SlideComponentProps {
  slide: Slide;
  theme: ThemeDefinition;
  isEditable?: boolean;
  onEditTitle?: (value: string) => void;
  onEditSubtitle?: (value: string) => void;
  onEditBody?: (value: string) => void;
  onEditBullet?: (index: number, value: string) => void;
  onEditQuote?: (value: string) => void;
  onEditAttribution?: (value: string) => void;
  onEditChartData?: (data: ChartDataPoint[]) => void;
}

/**
 * A theme must provide components for each slide type
 */
export interface ThemeSlideComponents {
  TitleSlide: React.ComponentType<SlideComponentProps>;
  ContentSlide: React.ComponentType<SlideComponentProps>;
  BulletsSlide: React.ComponentType<SlideComponentProps>;
  QuoteSlide: React.ComponentType<SlideComponentProps>;
  SectionSlide: React.ComponentType<SlideComponentProps>;
  ChartSlide: React.ComponentType<SlideComponentProps>;
}

/**
 * Complete theme registration with config and components
 */
export interface ThemeRegistration {
  config: ThemeDefinition;
  components: ThemeSlideComponents;
}

/**
 * Slide container props for the shared container component
 */
export interface SlideContainerProps {
  theme: ThemeDefinition;
  children: React.ReactNode;
  className?: string;
}

/**
 * Editable text component props
 */
export interface EditableTextProps {
  value: string | null | undefined;
  onChange?: (value: string) => void;
  isEditable?: boolean;
  className?: string;
  style?: React.CSSProperties;
  as?: 'h1' | 'h2' | 'p' | 'span' | 'blockquote';
  placeholder?: string;
  focusRingColor?: string;
}

/**
 * Bullet marker props for different bullet styles
 */
export interface BulletMarkerProps {
  style: ThemeDefinition['decorations']['bullet_style'];
  color: string;
  size: string;
  index?: number;
}
