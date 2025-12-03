'use client';

import { cn } from '@/lib/utils/cn';
import { EditableText, SlideContainer, BulletMarker } from '../../base';
import type { SlideComponentProps } from '../../base/types';
import { getTailwindFontSize, getAlignmentClasses, getVerticalPositionClasses } from '../utils';

export function BulletsSlide({
  slide,
  theme,
  isEditable = true,
  onEditTitle,
  onEditBullet,
}: SlideComponentProps) {
  const { colors, typography, layout, spacing, decorations } = theme;

  return (
    <SlideContainer theme={theme}>
      <div
        className={cn(
          'h-full flex flex-col',
          getVerticalPositionClasses(layout.vertical_position)
        )}
      >
        <div
          className="w-full"
          style={{ maxWidth: spacing.content_max_width }}
        >
          {(slide.title || isEditable) && (
            <EditableText
              as="h2"
              value={slide.title}
              onChange={onEditTitle}
              isEditable={isEditable}
              className={cn(getTailwindFontSize(typography.heading_size), 'mb-8')}
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
          <ul
            className="flex flex-col"
            style={{ gap: spacing.bullet_gap }}
          >
            {slide.bullets?.map((bullet, i) => (
              <li key={i} className="flex items-start gap-4">
                <BulletMarker
                  style={decorations.bullet_style}
                  color={colors.accent}
                  size={decorations.bullet_size}
                  index={i}
                />
                <EditableText
                  as="span"
                  value={bullet}
                  onChange={onEditBullet ? (v) => onEditBullet(i, v) : undefined}
                  isEditable={isEditable}
                  className={getTailwindFontSize(typography.body_size)}
                  style={{
                    color: colors.text_primary,
                    fontFamily: typography.body_font,
                    fontWeight: typography.body_weight,
                    lineHeight: typography.body_line_height,
                  }}
                  placeholder="Bullet point"
                  focusRingColor={colors.accent}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SlideContainer>
  );
}
