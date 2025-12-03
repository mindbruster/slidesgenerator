'use client';

interface BackgroundPatternProps {
  pattern: 'dots' | 'grid' | 'scanlines' | 'noise';
  color: string;
  opacity: number;
}

/**
 * Renders decorative background patterns for slides.
 * Supports: dots, grid, scanlines, noise
 */
export function BackgroundPattern({ pattern, color, opacity }: BackgroundPatternProps) {
  const getPatternStyle = (): React.CSSProperties => {
    switch (pattern) {
      case 'dots':
        return {
          backgroundImage: `radial-gradient(${color} 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        };

      case 'grid':
        return {
          backgroundImage: `
            linear-gradient(${color} 1px, transparent 1px),
            linear-gradient(90deg, ${color} 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        };

      case 'scanlines':
        return {
          backgroundImage: `repeating-linear-gradient(
            0deg,
            ${color} 0px,
            ${color} 1px,
            transparent 1px,
            transparent 3px
          )`,
        };

      case 'noise':
        // CSS noise pattern approximation
        return {
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        };

      default:
        return {};
    }
  };

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        ...getPatternStyle(),
        opacity,
      }}
    />
  );
}
