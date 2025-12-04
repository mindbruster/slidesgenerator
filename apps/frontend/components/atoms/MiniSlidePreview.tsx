'use client';

import { THEMES } from '@/lib/themes';
import type { TemplateSlide as OldTemplateSlide } from '@/lib/templates';
import type { TemplateSlide as APITemplateSlide } from '@/lib/types/template';
import type { ThemeName, ThemeDefinition } from '@/lib/types/slide';

// Support both old client-side templates and new API templates
type TemplateSlide = OldTemplateSlide | APITemplateSlide;

interface MiniSlidePreviewProps {
  slide: TemplateSlide;
  theme: ThemeName;
  scale?: number;
}

// Type guard to check if slide is API template slide
function isAPITemplateSlide(slide: TemplateSlide): slide is APITemplateSlide {
  return 'slide_type' in slide;
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
          ...(slide.image_url && {
            backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.6)), url(${slide.image_url})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }),
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
  // Normalize slide data for both old and new formats
  const slideType = isAPITemplateSlide(slide) ? slide.slide_type : slide.type;
  const title = isAPITemplateSlide(slide) ? slide.placeholder_title : slide.title;
  const body = isAPITemplateSlide(slide) ? slide.placeholder_body : slide.body;
  const subtitle = isAPITemplateSlide(slide) ? null : slide.subtitle;
  const bullets = isAPITemplateSlide(slide) ? slide.placeholder_bullets : slide.bullets;
  const quote = isAPITemplateSlide(slide) ? null : slide.quote;
  const attribution = isAPITemplateSlide(slide) ? null : slide.attribution;
  const leftContent = isAPITemplateSlide(slide) ? null : slide.leftContent;
  const rightContent = isAPITemplateSlide(slide) ? null : slide.rightContent;
  const aiInstructions = isAPITemplateSlide(slide) ? slide.ai_instructions : null;

  // When there's a background image, use white text for better contrast
  const hasBackgroundImage = !!slide.image_url;
  const textPrimary = hasBackgroundImage ? '#ffffff' : theme.colors.text_primary;
  const textSecondary = hasBackgroundImage ? '#e0e0e0' : theme.colors.text_secondary;

  const titleStyle = {
    color: textPrimary,
    fontFamily: theme.typography.heading_font,
    fontWeight: theme.typography.title_weight,
    fontSize: `${getFontSize(theme.typography.title_size) * scale}px`,
    letterSpacing: theme.typography.title_letter_spacing,
    lineHeight: theme.typography.title_line_height,
    textTransform: theme.typography.title_transform as React.CSSProperties['textTransform'],
    textAlign: theme.layout.title_alignment as React.CSSProperties['textAlign'],
  };

  const headingStyle = {
    color: textPrimary,
    fontFamily: theme.typography.heading_font,
    fontWeight: theme.typography.heading_weight,
    fontSize: `${getFontSize(theme.typography.heading_size) * scale}px`,
    letterSpacing: theme.typography.heading_letter_spacing,
    textAlign: theme.layout.title_alignment as React.CSSProperties['textAlign'],
  };

  const bodyStyle = {
    color: textSecondary,
    fontFamily: theme.typography.body_font,
    fontWeight: theme.typography.body_weight,
    fontSize: `${getFontSize(theme.typography.body_size) * scale}px`,
    lineHeight: theme.typography.body_line_height,
    textAlign: theme.layout.content_alignment as React.CSSProperties['textAlign'],
  };

  const gap = `${parseInt(theme.spacing.element_gap) * scale}px`;

  switch (slideType) {
    case 'title':
      return (
        <div className="flex flex-col" style={{ gap, textAlign: theme.layout.title_alignment }}>
          <h1 style={titleStyle}>{title || 'Title Slide'}</h1>
          {subtitle && (
            <p style={{ ...bodyStyle, color: textSecondary }}>
              {subtitle}
            </p>
          )}
          {aiInstructions && !title && (
            <p style={{ ...bodyStyle, color: textSecondary, fontStyle: 'italic' }}>
              {aiInstructions}
            </p>
          )}
        </div>
      );

    case 'section':
      return (
        <div className="flex flex-col items-center justify-center">
          <h2 style={{ ...titleStyle, color: hasBackgroundImage ? '#ffffff' : theme.colors.accent }}>{title || 'Section'}</h2>
        </div>
      );

    case 'content':
      return (
        <div className="flex flex-col" style={{ gap }}>
          {title && <h2 style={headingStyle}>{title}</h2>}
          {body && <p style={bodyStyle}>{body}</p>}
          {aiInstructions && !body && (
            <p style={{ ...bodyStyle, fontStyle: 'italic' }}>{aiInstructions}</p>
          )}
        </div>
      );

    case 'bullets':
      return (
        <div className="flex flex-col" style={{ gap }}>
          {title && <h2 style={headingStyle}>{title}</h2>}
          {bullets && bullets.length > 0 ? (
            <ul style={{ paddingLeft: `${20 * scale}px` }}>
              {bullets.map((bullet, i) => (
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
          ) : aiInstructions ? (
            <p style={{ ...bodyStyle, fontStyle: 'italic' }}>{aiInstructions}</p>
          ) : null}
        </div>
      );

    case 'quote':
      return (
        <div className="flex flex-col items-center justify-center text-center" style={{ gap }}>
          {quote ? (
            <>
              <blockquote
                style={{
                  color: theme.colors.text_primary,
                  fontFamily: theme.typography.body_font,
                  fontSize: `${getFontSize(theme.typography.quote_size) * scale}px`,
                  fontStyle: theme.typography.quote_style,
                  maxWidth: '80%',
                }}
              >
                "{quote}"
              </blockquote>
              {attribution && (
                <cite style={{ ...bodyStyle, fontStyle: 'normal' }}>— {attribution}</cite>
              )}
            </>
          ) : aiInstructions ? (
            <p style={{ ...bodyStyle, fontStyle: 'italic' }}>{aiInstructions}</p>
          ) : (
            <p style={bodyStyle}>Quote Slide</p>
          )}
        </div>
      );

    case 'chart':
      return (
        <div className="flex flex-col" style={{ gap }}>
          {title && <h2 style={headingStyle}>{title}</h2>}
          <div
            className="flex items-center justify-center"
            style={{
              height: `${200 * scale}px`,
              backgroundColor: theme.colors.surface,
              borderRadius: theme.style.border_radius,
              border: `${theme.style.border_width} ${theme.style.border_style} ${theme.colors.border}`,
            }}
          >
            <p style={{ ...bodyStyle, fontStyle: 'italic', color: textPrimary }}>
              {aiInstructions || 'Chart visualization'}
            </p>
          </div>
        </div>
      );

    case 'stats':
      return (
        <div className="flex flex-col" style={{ gap }}>
          {title && <h2 style={headingStyle}>{title}</h2>}
          <div className="flex justify-center" style={{ gap }}>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex flex-col items-center"
                style={{
                  padding: `${20 * scale}px`,
                  backgroundColor: theme.colors.surface,
                  borderRadius: theme.style.border_radius,
                  border: `${theme.style.border_width} ${theme.style.border_style} ${theme.colors.border}`,
                }}
              >
                <span style={{ ...titleStyle, fontSize: `${36 * scale}px`, color: theme.colors.accent }}>
                  #{i}
                </span>
                <span style={bodyStyle}>Metric</span>
              </div>
            ))}
          </div>
        </div>
      );

    case 'big_number':
      return (
        <div className="flex flex-col items-center justify-center text-center" style={{ gap }}>
          {title && <h2 style={headingStyle}>{title}</h2>}
          <span style={{ ...titleStyle, fontSize: `${72 * scale}px`, color: theme.colors.accent }}>
            100%
          </span>
          <p style={bodyStyle}>{aiInstructions || 'Key metric'}</p>
        </div>
      );

    case 'comparison':
      return (
        <div className="flex flex-col" style={{ gap }}>
          {title && <h2 style={headingStyle}>{title}</h2>}
          <div className="flex" style={{ gap }}>
            <div
              className="flex-1 p-2"
              style={{
                backgroundColor: theme.colors.surface,
                borderRadius: theme.style.border_radius,
                border: `${theme.style.border_width} ${theme.style.border_style} ${theme.colors.border}`,
              }}
            >
              <p style={{ ...bodyStyle, textAlign: 'center' }}>Option A</p>
            </div>
            <div
              className="flex-1 p-2"
              style={{
                backgroundColor: theme.colors.accent + '20',
                borderRadius: theme.style.border_radius,
                border: `${theme.style.border_width} ${theme.style.border_style} ${theme.colors.accent}`,
              }}
            >
              <p style={{ ...bodyStyle, textAlign: 'center' }}>Option B</p>
            </div>
          </div>
        </div>
      );

    case 'timeline':
      return (
        <div className="flex flex-col" style={{ gap }}>
          {title && <h2 style={headingStyle}>{title}</h2>}
          <div className="flex items-center justify-center" style={{ gap: `${10 * scale}px` }}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center" style={{ gap: `${5 * scale}px` }}>
                <div
                  style={{
                    width: `${20 * scale}px`,
                    height: `${20 * scale}px`,
                    borderRadius: '50%',
                    backgroundColor: theme.colors.accent,
                  }}
                />
                {i < 4 && (
                  <div
                    style={{
                      width: `${30 * scale}px`,
                      height: `${2 * scale}px`,
                      backgroundColor: theme.colors.border,
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      );

    case 'two-column':
      return (
        <div className="flex flex-col" style={{ gap }}>
          {title && <h2 style={headingStyle}>{title}</h2>}
          <div className="flex" style={{ gap }}>
            <div className="flex-1">
              {leftContent?.map((item, i) => (
                <p key={i} style={{ ...bodyStyle, marginBottom: `${8 * scale}px` }}>{item}</p>
              ))}
            </div>
            <div className="flex-1">
              {rightContent?.map((item, i) => (
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
