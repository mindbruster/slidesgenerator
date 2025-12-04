'use client';

import { cn } from '@/lib/utils/cn';
import { EditableText, SlideContainer } from '../../base';
import type { SlideComponentProps } from '../../base/types';
import { getTailwindFontSize, getVerticalPositionClasses } from '../utils';

export function SectionSlide({
  slide,
  theme,
  isEditable = true,
  onEditTitle,
}: SlideComponentProps) {
  const { colors, typography, layout, decorations } = theme;

  const renderDivider = () => {
    switch (decorations.section_divider) {
      case 'line':
        return (
          <div
            className="w-16 h-0.5 mx-auto mb-8"
            style={{ backgroundColor: colors.accent }}
          />
        );
      case 'accent-block':
        return (
          <div
            className="w-16 h-2 mx-auto mb-8 rounded"
            style={{ backgroundColor: colors.accent }}
          />
        );
      case 'gradient':
        return (
          <div
            className="w-24 h-1 mx-auto mb-8 rounded-full"
            style={{
              background: `linear-gradient(90deg, transparent, ${colors.accent}, transparent)`,
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SlideContainer theme={theme} imageUrl={slide.image_url}>
      <div
        className={cn(
          'h-full flex flex-col items-center text-center',
          getVerticalPositionClasses(layout.vertical_position)
        )}
      >
        <div className="max-w-3xl">
          {renderDivider()}
          <EditableText
            as="h2"
            value={slide.title}
            onChange={onEditTitle}
            isEditable={isEditable}
            className={getTailwindFontSize(typography.title_size)}
            style={{
              color: colors.text_primary,
              fontFamily: typography.heading_font,
              fontWeight: typography.title_weight,
              letterSpacing: typography.title_letter_spacing,
            }}
            placeholder="Section Title"
            focusRingColor={colors.accent}
          />
        </div>
      </div>
    </SlideContainer>
  );
}
