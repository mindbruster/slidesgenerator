'use client';

import { cn } from '@/lib/utils/cn';
import { EditableText, SlideContainer } from '../../base';
import type { SlideComponentProps } from '../../base/types';
import { getTailwindFontSize, getVerticalPositionClasses } from '../utils';

export function BigNumberSlide({
  slide,
  theme,
  isEditable = true,
  onEditTitle,
}: SlideComponentProps) {
  const { colors, typography, layout } = theme;

  return (
    <SlideContainer theme={theme}>
      <div
        className={cn(
          'h-full flex flex-col items-center text-center',
          getVerticalPositionClasses(layout.vertical_position)
        )}
      >
        {/* Title (smaller, above the number) */}
        {(slide.title || isEditable) && (
          <EditableText
            as="h2"
            value={slide.title}
            onChange={onEditTitle}
            isEditable={isEditable}
            className={cn(getTailwindFontSize(typography.heading_size), 'mb-6')}
            style={{
              color: colors.text_secondary,
              fontFamily: typography.heading_font,
              fontWeight: typography.heading_weight,
              letterSpacing: typography.heading_letter_spacing,
            }}
            placeholder="The Impact"
            focusRingColor={colors.accent}
          />
        )}

        {/* Hero Number */}
        <div
          className="text-8xl md:text-9xl lg:text-[12rem] font-black leading-none mb-4"
          style={{
            color: colors.accent,
            fontFamily: typography.heading_font,
            textShadow: `4px 4px 0px ${colors.border_dark}`,
          }}
        >
          {slide.big_number_value || '10x'}
        </div>

        {/* Label */}
        {slide.big_number_label && (
          <div
            className="text-2xl md:text-3xl font-bold mb-4"
            style={{
              color: colors.text_primary,
              fontFamily: typography.heading_font,
            }}
          >
            {slide.big_number_label}
          </div>
        )}

        {/* Context */}
        {slide.big_number_context && (
          <div
            className={cn(getTailwindFontSize(typography.body_size), 'max-w-2xl')}
            style={{
              color: colors.text_secondary,
              fontFamily: typography.body_font,
              lineHeight: typography.body_line_height,
            }}
          >
            {slide.big_number_context}
          </div>
        )}
      </div>
    </SlideContainer>
  );
}
