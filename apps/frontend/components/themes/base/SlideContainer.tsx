'use client';

import { cn } from '@/lib/utils/cn';
import type { SlideContainerProps } from './types';
import { BackgroundPattern } from './BackgroundPattern';

/**
 * Shared slide container that applies theme styling.
 * Handles: background, borders, shadows, accent bars, patterns, and background images.
 */
export function SlideContainer({ theme, children, className, imageUrl }: SlideContainerProps) {
  const { colors, style, spacing } = theme;

  // Build shadow CSS - append color if shadow is offset style
  const getShadowCSS = () => {
    if (!style.shadow) return 'none';

    // If shadow looks like an offset shadow (e.g., "4px 4px 0px 0px"), append border color
    if (style.shadow.match(/^\d+px\s+\d+px\s+\d+px\s+\d+px$/)) {
      return `${style.shadow} ${colors.border_dark}`;
    }

    // Otherwise use as-is (e.g., rgba shadows)
    return style.shadow;
  };

  // Build background CSS - use gradient if available, otherwise solid color
  const getBackgroundCSS = (): React.CSSProperties => {
    // Background images are now displayed inline in slide content, not as backgrounds
    if (style.background_gradient) {
      return {
        background: style.background_gradient,
      };
    }
    return {
      backgroundColor: colors.background,
    };
  };

  return (
    <div
      className={cn('w-full aspect-video overflow-hidden relative', className)}
      style={{
        ...getBackgroundCSS(),
        borderWidth: style.border_width,
        borderStyle: style.border_style,
        borderColor: colors.border_dark,
        borderRadius: style.border_radius,
        boxShadow: getShadowCSS(),
      } as React.CSSProperties}
    >
      {/* Background pattern overlay */}
      {style.background_pattern !== 'none' && (
        <BackgroundPattern
          pattern={style.background_pattern}
          color={colors.accent}
          opacity={style.pattern_opacity}
        />
      )}

      {/* Accent bar decoration */}
      {style.accent_bar_position !== 'none' && (
        <div
          className={cn('absolute', {
            'top-0 left-0 right-0': style.accent_bar_position === 'top',
            'bottom-0 left-0 right-0': style.accent_bar_position === 'bottom',
            'top-0 bottom-0 left-0': style.accent_bar_position === 'left',
          })}
          style={{
            backgroundColor: colors.accent,
            width: style.accent_bar_position === 'left' ? style.accent_bar_width : '100%',
            height:
              style.accent_bar_position === 'top' || style.accent_bar_position === 'bottom'
                ? style.accent_bar_width
                : '100%',
          }}
        />
      )}

      {/* Content */}
      <div
        className="h-full relative z-10"
        style={{
          padding: spacing.slide_padding,
        }}
      >
        {children}
      </div>
    </div>
  );
}
