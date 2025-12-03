/**
 * Utility functions for the Neobrutalism theme
 */

/**
 * Convert theme size tokens to Tailwind classes
 */
export function getTailwindFontSize(size: string): string {
  const sizeMap: Record<string, string> = {
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl md:text-5xl',
    '5xl': 'text-4xl md:text-5xl lg:text-6xl',
    '6xl': 'text-5xl md:text-6xl lg:text-7xl',
    '7xl': 'text-6xl md:text-7xl lg:text-8xl',
  };
  return sizeMap[size] || `text-${size}`;
}

/**
 * Get alignment classes for Tailwind
 */
export function getAlignmentClasses(alignment: 'left' | 'center' | 'right'): string {
  const alignmentMap: Record<string, string> = {
    left: 'items-start text-left',
    center: 'items-center text-center',
    right: 'items-end text-right',
  };
  return alignmentMap[alignment] || 'items-start text-left';
}

/**
 * Get vertical position classes
 */
export function getVerticalPositionClasses(position: 'top' | 'center' | 'bottom'): string {
  const positionMap: Record<string, string> = {
    top: 'justify-start',
    center: 'justify-center',
    bottom: 'justify-end',
  };
  return positionMap[position] || 'justify-center';
}
