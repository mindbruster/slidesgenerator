'use client';

import { cn } from '@/lib/utils/cn';
import { EditableText, SlideContainer } from '../../base';
import type { SlideComponentProps } from '../../base/types';
import { getTailwindFontSize, getVerticalPositionClasses } from '../utils';
import { Check, X } from 'lucide-react';

export function ComparisonSlide({
  slide,
  theme,
  isEditable = true,
  onEditTitle,
}: SlideComponentProps) {
  const { colors, typography, layout, spacing, style } = theme;
  const columns = slide.comparison_columns || [];

  // Default to 2 columns if not provided
  const leftColumn = columns[0] || { title: 'Before', items: [], highlight: false };
  const rightColumn = columns[1] || { title: 'After', items: [], highlight: true };

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
            placeholder="Before vs After"
            focusRingColor={colors.accent}
          />
        )}

        {/* Comparison Grid */}
        <div className="grid grid-cols-2 gap-8 flex-1">
          {/* Left Column */}
          <div
            className={cn(
              'flex flex-col p-6 rounded-xl',
              !leftColumn.highlight && 'opacity-75'
            )}
            style={{
              backgroundColor: leftColumn.highlight ? colors.accent_light : colors.surface,
              border: `${style.border_width} ${style.border_style} ${leftColumn.highlight ? colors.accent : colors.border}`,
              borderRadius: style.border_radius,
            }}
          >
            <h3
              className="text-2xl font-bold mb-6 text-center"
              style={{
                color: leftColumn.highlight ? colors.accent : colors.text_secondary,
                fontFamily: typography.heading_font,
              }}
            >
              {leftColumn.title}
            </h3>
            <ul className="space-y-4">
              {leftColumn.items.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span
                    className="flex-shrink-0 mt-1"
                    style={{ color: leftColumn.highlight ? colors.accent : colors.text_secondary }}
                  >
                    {leftColumn.highlight ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <X className="w-5 h-5" />
                    )}
                  </span>
                  <span
                    className={getTailwindFontSize(typography.body_size)}
                    style={{
                      color: colors.text_primary,
                      fontFamily: typography.body_font,
                    }}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column */}
          <div
            className={cn(
              'flex flex-col p-6 rounded-xl',
              !rightColumn.highlight && 'opacity-75'
            )}
            style={{
              backgroundColor: rightColumn.highlight ? colors.accent_light : colors.surface,
              border: `${style.border_width} ${style.border_style} ${rightColumn.highlight ? colors.accent : colors.border}`,
              borderRadius: style.border_radius,
              boxShadow: rightColumn.highlight && style.shadow
                ? `${style.shadow} ${colors.accent}`
                : undefined,
            }}
          >
            <h3
              className="text-2xl font-bold mb-6 text-center"
              style={{
                color: rightColumn.highlight ? colors.accent : colors.text_secondary,
                fontFamily: typography.heading_font,
              }}
            >
              {rightColumn.title}
            </h3>
            <ul className="space-y-4">
              {rightColumn.items.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span
                    className="flex-shrink-0 mt-1"
                    style={{ color: rightColumn.highlight ? colors.accent : colors.text_secondary }}
                  >
                    {rightColumn.highlight ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <X className="w-5 h-5" />
                    )}
                  </span>
                  <span
                    className={getTailwindFontSize(typography.body_size)}
                    style={{
                      color: colors.text_primary,
                      fontFamily: typography.body_font,
                    }}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </SlideContainer>
  );
}
