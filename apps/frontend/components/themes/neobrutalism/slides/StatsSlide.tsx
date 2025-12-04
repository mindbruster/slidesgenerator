'use client';

import { cn } from '@/lib/utils/cn';
import { EditableText, SlideContainer } from '../../base';
import type { SlideComponentProps } from '../../base/types';
import { getTailwindFontSize, getVerticalPositionClasses } from '../utils';

export function StatsSlide({
  slide,
  theme,
  isEditable = true,
  onEditTitle,
}: SlideComponentProps) {
  const { colors, typography, layout, spacing, style } = theme;
  const stats = slide.stats || [];

  // Determine grid layout based on number of stats
  const getGridCols = () => {
    if (stats.length <= 2) return 'grid-cols-2';
    if (stats.length === 3) return 'grid-cols-3';
    return 'grid-cols-2 md:grid-cols-4';
  };

  return (
    <SlideContainer theme={theme}>
      <div
        className={cn(
          'h-full flex flex-col',
          getVerticalPositionClasses(layout.vertical_position)
        )}
      >
        {/* Title */}
        {(slide.title || isEditable) && (
          <EditableText
            as="h2"
            value={slide.title}
            onChange={onEditTitle}
            isEditable={isEditable}
            className={cn(
              getTailwindFontSize(typography.heading_size),
              'mb-12 text-center'
            )}
            style={{
              color: colors.text_primary,
              fontFamily: typography.heading_font,
              fontWeight: typography.heading_weight,
              letterSpacing: typography.heading_letter_spacing,
            }}
            placeholder="Key Metrics"
            focusRingColor={colors.accent}
          />
        )}

        {/* Stats Grid */}
        <div className={cn('grid gap-6', getGridCols())}>
          {stats.map((stat, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center p-6 rounded-xl text-center"
              style={{
                backgroundColor: colors.surface,
                border: `${style.border_width} ${style.border_style} ${colors.border_dark}`,
                borderRadius: style.border_radius,
                boxShadow: style.shadow ? `${style.shadow} ${colors.border_dark}` : undefined,
              }}
            >
              {/* Big Value */}
              <span
                className="text-5xl md:text-6xl font-bold mb-2"
                style={{
                  color: colors.accent,
                  fontFamily: typography.heading_font,
                }}
              >
                {stat.value}
              </span>

              {/* Label */}
              <span
                className="text-lg font-semibold"
                style={{
                  color: colors.text_primary,
                  fontFamily: typography.body_font,
                }}
              >
                {stat.label}
              </span>

              {/* Description */}
              {stat.description && (
                <span
                  className="text-sm mt-1"
                  style={{
                    color: colors.text_secondary,
                    fontFamily: typography.body_font,
                  }}
                >
                  {stat.description}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </SlideContainer>
  );
}
