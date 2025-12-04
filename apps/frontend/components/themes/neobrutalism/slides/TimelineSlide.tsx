'use client';

import { cn } from '@/lib/utils/cn';
import { EditableText, SlideContainer } from '../../base';
import type { SlideComponentProps } from '../../base/types';
import { getTailwindFontSize, getVerticalPositionClasses } from '../utils';

export function TimelineSlide({
  slide,
  theme,
  isEditable = true,
  onEditTitle,
}: SlideComponentProps) {
  const { colors, typography, layout, style } = theme;
  const items = slide.timeline_items || [];

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
              'mb-10 text-center'
            )}
            style={{
              color: colors.text_primary,
              fontFamily: typography.heading_font,
              fontWeight: typography.heading_weight,
              letterSpacing: typography.heading_letter_spacing,
            }}
            placeholder="Timeline"
            focusRingColor={colors.accent}
          />
        )}

        {/* Horizontal Timeline */}
        <div className="flex-1 flex items-center">
          <div className="relative w-full">
            {/* Timeline Line */}
            <div
              className="absolute top-6 left-0 right-0 h-1"
              style={{ backgroundColor: colors.border }}
            />

            {/* Timeline Items */}
            <div
              className="relative grid gap-4"
              style={{
                gridTemplateColumns: `repeat(${items.length}, 1fr)`,
              }}
            >
              {items.map((item, index) => (
                <div key={index} className="flex flex-col items-center">
                  {/* Circle */}
                  <div
                    className="relative z-10 w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold mb-4"
                    style={{
                      backgroundColor: colors.accent,
                      color: colors.background,
                      fontFamily: typography.heading_font,
                      border: `3px solid ${colors.border_dark}`,
                      boxShadow: style.shadow
                        ? `${style.shadow} ${colors.border_dark}`
                        : undefined,
                    }}
                  >
                    {index + 1}
                  </div>

                  {/* Content Card */}
                  <div
                    className="w-full p-4 rounded-xl text-center"
                    style={{
                      backgroundColor: colors.surface,
                      border: `${style.border_width} ${style.border_style} ${colors.border}`,
                      borderRadius: style.border_radius,
                    }}
                  >
                    {/* Date/Phase */}
                    {item.date && (
                      <span
                        className="text-xs font-semibold uppercase tracking-wider mb-1 block"
                        style={{
                          color: colors.accent,
                          fontFamily: typography.body_font,
                        }}
                      >
                        {item.date}
                      </span>
                    )}

                    {/* Title */}
                    <h4
                      className="text-lg font-bold mb-1"
                      style={{
                        color: colors.text_primary,
                        fontFamily: typography.heading_font,
                      }}
                    >
                      {item.title}
                    </h4>

                    {/* Description */}
                    {item.description && (
                      <p
                        className="text-sm"
                        style={{
                          color: colors.text_secondary,
                          fontFamily: typography.body_font,
                          lineHeight: 1.4,
                        }}
                      >
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SlideContainer>
  );
}
