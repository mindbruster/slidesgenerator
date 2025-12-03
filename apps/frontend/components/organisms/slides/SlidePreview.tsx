'use client';

/**
 * SlidePreview Component
 *
 * Renders a slide using theme-specific components.
 * The component dynamically selects the appropriate slide component
 * based on the theme and slide type.
 */

import type { Slide, ChartDataPoint, ThemeName } from '@/lib/types';
import { THEMES } from '@/lib/themes';
import { getSlideComponent } from '@/components/themes';

interface SlidePreviewProps {
  slide: Slide;
  theme?: ThemeName;
  onEditTitle?: (value: string) => void;
  onEditSubtitle?: (value: string) => void;
  onEditBody?: (value: string) => void;
  onEditBullet?: (index: number, value: string) => void;
  onEditQuote?: (value: string) => void;
  onEditAttribution?: (value: string) => void;
  onEditChartData?: (data: ChartDataPoint[]) => void;
  isEditable?: boolean;
}

export function SlidePreview({
  slide,
  theme = 'neobrutalism',
  onEditTitle,
  onEditSubtitle,
  onEditBody,
  onEditBullet,
  onEditQuote,
  onEditAttribution,
  onEditChartData,
  isEditable = true,
}: SlidePreviewProps) {
  // Get theme configuration
  const themeConfig = THEMES[theme] || THEMES.neobrutalism;

  // Dynamically get the slide component for this theme and slide type
  const SlideComponent = getSlideComponent(theme, slide.type);

  return (
    <SlideComponent
      slide={slide}
      theme={themeConfig}
      isEditable={isEditable}
      onEditTitle={onEditTitle}
      onEditSubtitle={onEditSubtitle}
      onEditBody={onEditBody}
      onEditBullet={onEditBullet}
      onEditQuote={onEditQuote}
      onEditAttribution={onEditAttribution}
      onEditChartData={onEditChartData}
    />
  );
}
