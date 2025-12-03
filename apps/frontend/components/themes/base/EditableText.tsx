'use client';

import { cn } from '@/lib/utils/cn';
import type { EditableTextProps } from './types';

/**
 * Shared editable text component used by all theme slide components.
 * Provides inline content editing with theme-aware focus styling.
 */
export function EditableText({
  value,
  onChange,
  isEditable = true,
  className,
  style,
  as: Component = 'p',
  placeholder = 'Click to edit...',
  focusRingColor = '#ff90e8',
}: EditableTextProps) {
  // Non-editable mode: just render the text
  if (!isEditable || !onChange) {
    return (
      <Component className={className} style={style}>
        {value || placeholder}
      </Component>
    );
  }

  // Editable mode: render contentEditable element
  return (
    <Component
      contentEditable
      suppressContentEditableWarning
      onBlur={(e) => onChange(e.currentTarget.textContent || '')}
      className={cn(
        className,
        'outline-none',
        'focus:ring-2 focus:ring-offset-2',
        'rounded px-1 -mx-1',
        'cursor-text'
      )}
      style={
        {
          ...style,
          '--tw-ring-color': focusRingColor,
        } as React.CSSProperties
      }
    >
      {value || placeholder}
    </Component>
  );
}
