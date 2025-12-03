'use client';

import { cn } from '@/lib/utils/cn';
import { EditableText, SlideContainer } from '../../base';
import type { SlideComponentProps } from '../../base/types';
import { getTailwindFontSize, getAlignmentClasses, getVerticalPositionClasses } from '../utils';

export function QuoteSlide({
  slide,
  theme,
  isEditable = true,
  onEditQuote,
  onEditAttribution,
}: SlideComponentProps) {
  const { colors, typography, layout, decorations } = theme;

  const renderQuoteDecoration = () => {
    switch (decorations.quote_style) {
      case 'large-mark':
        return (
          <span
            className="absolute -left-8 -top-4 text-6xl opacity-50"
            style={{ color: colors.accent }}
          >
            &ldquo;
          </span>
        );
      case 'accent-bar':
        return (
          <div
            className="absolute left-0 top-0 bottom-0 w-1"
            style={{ backgroundColor: colors.accent }}
          />
        );
      case 'icon':
        return (
          <div
            className="mb-4"
            style={{ color: colors.accent }}
          >
            <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <SlideContainer theme={theme}>
      <div
        className={cn(
          'h-full flex flex-col',
          getVerticalPositionClasses(layout.vertical_position),
          getAlignmentClasses(layout.content_alignment)
        )}
      >
        <div className={cn('max-w-3xl relative', getAlignmentClasses(layout.content_alignment))}>
          {renderQuoteDecoration()}
          <EditableText
            as="blockquote"
            value={slide.quote}
            onChange={onEditQuote}
            isEditable={isEditable}
            className={cn(
              getTailwindFontSize(typography.quote_size),
              'leading-relaxed',
              decorations.quote_style === 'accent-bar' ? 'pl-6' : ''
            )}
            style={{
              color: colors.text_primary,
              fontFamily: typography.body_font,
              fontStyle: typography.quote_style,
            }}
            placeholder="Enter quote..."
            focusRingColor={colors.accent}
          />
          {(slide.attribution || isEditable) && (
            <EditableText
              as="p"
              value={slide.attribution ? `— ${slide.attribution}` : undefined}
              onChange={onEditAttribution}
              isEditable={isEditable}
              className="mt-6 text-lg"
              style={{
                color: colors.text_secondary,
                fontFamily: typography.body_font,
              }}
              placeholder="— Attribution"
              focusRingColor={colors.accent}
            />
          )}
        </div>
      </div>
    </SlideContainer>
  );
}
