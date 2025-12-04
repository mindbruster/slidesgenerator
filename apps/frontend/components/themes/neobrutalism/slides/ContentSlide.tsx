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
  const { colors, typography, layout, spacing, style } = theme;
  const hasImage = !!slide.image_url;

  return (
    <SlideContainer theme={theme}>
      <div
        className={cn(
          'h-full flex',
          hasImage ? 'flex-row gap-8' : 'flex-col',
          getVerticalPositionClasses(layout.vertical_position),
          !hasImage && getAlignmentClasses(layout.content_alignment)
        )}
      >
        {/* Text content */}
        <div
          className={cn(
            'flex flex-col justify-center',
            hasImage ? 'w-1/2' : 'w-full',
            getAlignmentClasses(layout.content_alignment)
          )}
          style={{ maxWidth: hasImage ? undefined : spacing.content_max_width }}
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

        {/* Image */}
        {hasImage && (
          <div className="w-1/2 flex flex-col justify-center">
            <div
              className="relative overflow-hidden"
              style={{
                borderRadius: style.border_radius,
                border: style.border_style !== 'none' ? `${style.border_width} ${style.border_style} ${colors.border_dark}` : undefined,
                boxShadow: style.shadow || undefined,
              }}
            >
              <img
                src={slide.image_url!}
                alt={slide.image_alt || slide.title || 'Slide image'}
                className="w-full h-auto object-cover"
                style={{ maxHeight: '400px' }}
              />
            </div>
            {slide.image_credit && (
              <p
                className="mt-2 text-xs opacity-60"
                style={{ color: colors.text_secondary }}
              >
                {slide.image_credit}
              </p>
            )}
          </div>
        )}
      </div>
    </SlideContainer>
  );
}
