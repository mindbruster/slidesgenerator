'use client';

import { THEMES } from '@/lib/themes';
import type { TemplateSlide } from '@/lib/templates';
import type { ThemeName, ThemeDefinition } from '@/lib/types/slide';

interface MiniSlidePreviewProps {
  slide: TemplateSlide;
  theme: ThemeName;
  scale?: number;
}

export function MiniSlidePreview({ slide, theme, scale = 0.15 }: MiniSlidePreviewProps) {
  const themeConfig = THEMES[theme];

  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: `${1920 * scale}px`,
        height: `${1080 * scale}px`,
        fontSize: `${16 * scale}px`,
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: themeConfig.colors.background,
          fontFamily: themeConfig.typography.body_font,
        }}
      >
        {/* Accent bar */}
        {themeConfig.style.accent_bar_position !== 'none' && (
          <div
            className="absolute"
            style={{
              backgroundColor: themeConfig.colors.accent,
              ...(themeConfig.style.accent_bar_position === 'top' && {
                top: 0, left: 0, right: 0, height: `${parseInt(themeConfig.style.accent_bar_width) * scale}px`,
              }),
              ...(themeConfig.style.accent_bar_position === 'left' && {
                top: 0, bottom: 0, left: 0, width: `${parseInt(themeConfig.style.accent_bar_width) * scale}px`,
              }),
              ...(themeConfig.style.accent_bar_position === 'bottom' && {
                bottom: 0, left: 0, right: 0, height: `${parseInt(themeConfig.style.accent_bar_width) * scale}px`,
              }),
            }}
          />
        )}

        {/* Content */}
        <div
          className="absolute inset-0 flex flex-col"
          style={{
            padding: `${parseInt(themeConfig.spacing.slide_padding) * scale}px`,
            justifyContent: getVerticalAlignment(themeConfig),
          }}
        >
          <SlideContent slide={slide} theme={themeConfig} scale={scale} />
        </div>
      </div>
    </div>
  );
}

function getVerticalAlignment(theme: ThemeDefinition): string {
  switch (theme.layout.vertical_position) {
    case 'top': return 'flex-start';
    case 'bottom': return 'flex-end';
    default: return 'center';
  }
}

interface SlideContentProps {
  slide: TemplateSlide;
  theme: ThemeDefinition;
  scale: number;
}

function SlideContent({ slide, theme, scale }: SlideContentProps) {
  const titleStyle = {
    color: theme.colors.text_primary,
    fontFamily: theme.typography.heading_font,
    fontWeight: theme.typography.title_weight,
    fontSize: `${getFontSize(theme.typography.title_size) * scale}px`,
    letterSpacing: theme.typography.title_letter_spacing,
    lineHeight: theme.typography.title_line_height,
    textTransform: theme.typography.title_transform as React.CSSProperties['textTransform'],
    textAlign: theme.layout.title_alignment as React.CSSProperties['textAlign'],
  };

  const headingStyle = {
    color: theme.colors.text_primary,
    fontFamily: theme.typography.heading_font,
    fontWeight: theme.typography.heading_weight,
    fontSize: `${getFontSize(theme.typography.heading_size) * scale}px`,
    letterSpacing: theme.typography.heading_letter_spacing,
    textAlign: theme.layout.title_alignment as React.CSSProperties['textAlign'],
  };

  const bodyStyle = {
    color: theme.colors.text_secondary,
    fontFamily: theme.typography.body_font,
    fontWeight: theme.typography.body_weight,
    fontSize: `${getFontSize(theme.typography.body_size) * scale}px`,
    lineHeight: theme.typography.body_line_height,
    textAlign: theme.layout.content_alignment as React.CSSProperties['textAlign'],
  };

  const gap = `${parseInt(theme.spacing.element_gap) * scale}px`;

  switch (slide.type) {
    case 'title':
      return (
        <div className="flex flex-col" style={{ gap, textAlign: theme.layout.title_alignment }}>
          <h1 style={titleStyle}>{slide.title}</h1>
          {slide.subtitle && (
            <p style={{ ...bodyStyle, color: theme.colors.text_secondary }}>
              {slide.subtitle}
            </p>
          )}
        </div>
      );

    case 'section':
      return (
        <div className="flex flex-col items-center justify-center">
          <h2 style={{ ...titleStyle, color: theme.colors.accent }}>{slide.title}</h2>
        </div>
      );

    case 'content':
      return (
        <div className="flex flex-col" style={{ gap }}>
          {slide.title && <h2 style={headingStyle}>{slide.title}</h2>}
          {slide.body && <p style={bodyStyle}>{slide.body}</p>}
        </div>
      );

    case 'bullets':
      return (
        <div className="flex flex-col" style={{ gap }}>
          {slide.title && <h2 style={headingStyle}>{slide.title}</h2>}
          <ul style={{ paddingLeft: `${20 * scale}px` }}>
            {slide.bullets?.map((bullet, i) => (
              <li
                key={i}
                style={{
                  ...bodyStyle,
                  marginBottom: `${parseInt(theme.spacing.bullet_gap) * scale}px`,
                  listStyleType: getBulletStyle(theme.decorations.bullet_style),
                }}
              >
                {bullet}
              </li>
            ))}
          </ul>
        </div>
      );

    case 'quote':
      return (
        <div className="flex flex-col items-center justify-center text-center" style={{ gap }}>
          <blockquote
            style={{
              color: theme.colors.text_primary,
              fontFamily: theme.typography.body_font,
              fontSize: `${getFontSize(theme.typography.quote_size) * scale}px`,
              fontStyle: theme.typography.quote_style,
              maxWidth: '80%',
            }}
          >
            "{slide.quote}"
          </blockquote>
          {slide.attribution && (
            <cite style={{ ...bodyStyle, fontStyle: 'normal' }}>— {slide.attribution}</cite>
          )}
        </div>
      );

    case 'two-column':
      return (
        <div className="flex flex-col" style={{ gap }}>
          {slide.title && <h2 style={headingStyle}>{slide.title}</h2>}
          <div className="flex" style={{ gap }}>
            <div className="flex-1">
              {slide.leftContent?.map((item, i) => (
                <p key={i} style={{ ...bodyStyle, marginBottom: `${8 * scale}px` }}>{item}</p>
              ))}
            </div>
            <div className="flex-1">
              {slide.rightContent?.map((item, i) => (
                <p key={i} style={{ ...bodyStyle, marginBottom: `${8 * scale}px` }}>{item}</p>
              ))}
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
}

function getFontSize(size: string): number {
  const sizes: Record<string, number> = {
    'sm': 14,
    'base': 16,
    'lg': 18,
    'xl': 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
    '6xl': 60,
    '7xl': 72,
  };
  return sizes[size] || 16;
}

function getBulletStyle(style: string): string {
  switch (style) {
    case 'disc': return 'disc';
    case 'square': return 'square';
    case 'dash': return '"- "';
    case 'arrow': return '"→ "';
    case 'number': return 'decimal';
    case 'check': return '"✓ "';
    default: return 'disc';
  }
}
