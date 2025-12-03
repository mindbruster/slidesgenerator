'use client';

import { cn } from '@/lib/utils/cn';
import { EditableText, SlideContainer } from '../../base';
import type { SlideComponentProps } from '../../base/types';
import { getTailwindFontSize, getAlignmentClasses } from '../utils';

export function TitleSlide({
  slide,
  theme,
  isEditable = true,
  onEditTitle,
  onEditSubtitle,
}: SlideComponentProps) {
  const { colors, typography, layout } = theme;

  return (
    <SlideContainer theme={theme}>
      <div
        className={cn(
          'h-full flex flex-col justify-center',
          getAlignmentClasses(layout.title_alignment)
        )}
      >
        <div className={cn('max-w-4xl', getAlignmentClasses(layout.title_alignment))}>
          <EditableText
            as="h1"
            value={slide.title}
            onChange={onEditTitle}
            isEditable={isEditable}
            className={cn(
              getTailwindFontSize(typography.title_size),
              'leading-tight'
            )}
            style={{
              color: colors.text_primary,
              fontFamily: typography.heading_font,
              fontWeight: typography.title_weight,
              letterSpacing: typography.title_letter_spacing,
              lineHeight: typography.title_line_height,
              textTransform: typography.title_transform === 'none' ? undefined : typography.title_transform,
            }}
            placeholder="Presentation Title"
            focusRingColor={colors.accent}
          />
          {(slide.subtitle || isEditable) && (
            <EditableText
              as="p"
              value={slide.subtitle}
              onChange={onEditSubtitle}
              isEditable={isEditable}
              className="mt-4 text-xl md:text-2xl"
              style={{
                color: colors.text_secondary,
                fontFamily: typography.body_font,
                fontWeight: typography.body_weight,
              }}
              placeholder="Subtitle"
              focusRingColor={colors.accent}
            />
          )}
        </div>
      </div>
    </SlideContainer>
  );
}
