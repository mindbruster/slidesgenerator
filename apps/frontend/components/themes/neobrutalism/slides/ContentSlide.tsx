'use client';

import { cn } from '@/lib/utils/cn';
import { EditableText, SlideContainer } from '../../base';
import type { SlideComponentProps } from '../../base/types';
import { getTailwindFontSize, getAlignmentClasses, getVerticalPositionClasses } from '../utils';

export function ContentSlide({
  slide,
  theme,
  isEditable = true,
  onEditTitle,
  onEditBody,
}: SlideComponentProps) {
  const { colors, typography, layout, spacing } = theme;

  return (
    <SlideContainer theme={theme}>
      <div
        className={cn(
          'h-full flex flex-col',
          getVerticalPositionClasses(layout.vertical_position),
          getAlignmentClasses(layout.content_alignment)
        )}
      >
        <div
          className={cn('w-full', getAlignmentClasses(layout.content_alignment))}
          style={{ maxWidth: spacing.content_max_width }}
        >
          {(slide.title || isEditable) && (
            <EditableText
              as="h2"
              value={slide.title}
              onChange={onEditTitle}
              isEditable={isEditable}
              className={cn(getTailwindFontSize(typography.heading_size), 'mb-6')}
              style={{
                color: colors.text_primary,
                fontFamily: typography.heading_font,
                fontWeight: typography.heading_weight,
                letterSpacing: typography.heading_letter_spacing,
              }}
              placeholder="Slide Title"
              focusRingColor={colors.accent}
            />
          )}
          {(slide.body || isEditable) && (
            <EditableText
              as="p"
              value={slide.body}
              onChange={onEditBody}
              isEditable={isEditable}
              className={cn(getTailwindFontSize(typography.body_size), 'leading-relaxed')}
              style={{
                color: colors.text_primary,
                fontFamily: typography.body_font,
                fontWeight: typography.body_weight,
                lineHeight: typography.body_line_height,
              }}
              placeholder="Add content here..."
              focusRingColor={colors.accent}
            />
          )}
        </div>
      </div>
    </SlideContainer>
  );
}
