'use client';

import type { BulletMarkerProps } from './types';

/**
 * Renders different bullet marker styles based on theme configuration.
 * Supports: disc, dash, arrow, number, check, square
 */
export function BulletMarker({ style, color, size, index = 0 }: BulletMarkerProps) {
  const sizeNum = parseInt(size, 10) || 10;

  switch (style) {
    case 'disc':
      return (
        <span
          className="rounded-full flex-shrink-0 mt-1.5"
          style={{
            backgroundColor: color,
            width: size,
            height: size,
          }}
        />
      );

    case 'square':
      return (
        <span
          className="flex-shrink-0 mt-1.5"
          style={{
            backgroundColor: color,
            width: size,
            height: size,
          }}
        />
      );

    case 'dash':
      return (
        <span
          className="flex-shrink-0 mt-3"
          style={{
            backgroundColor: color,
            width: size,
            height: '2px',
          }}
        />
      );

    case 'arrow':
      return (
        <span
          className="flex-shrink-0 mt-1 font-mono"
          style={{
            color: color,
            fontSize: size,
            lineHeight: 1.5,
          }}
        >
          {'>'}
        </span>
      );

    case 'number':
      return (
        <span
          className="flex-shrink-0 rounded-full flex items-center justify-center text-white font-semibold"
          style={{
            backgroundColor: color,
            width: size,
            height: size,
            fontSize: `${Math.max(sizeNum * 0.5, 12)}px`,
          }}
        >
          {index + 1}
        </span>
      );

    case 'check':
      return (
        <span
          className="flex-shrink-0 flex items-center justify-center mt-0.5"
          style={{
            width: size,
            height: size,
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ width: '100%', height: '100%' }}
          >
            <path d="M5 12l5 5L20 7" />
          </svg>
        </span>
      );

    default:
      return (
        <span
          className="rounded-full flex-shrink-0 mt-1.5"
          style={{
            backgroundColor: color,
            width: size,
            height: size,
          }}
        />
      );
  }
}
