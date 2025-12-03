'use client';

import { cn } from '@/lib/utils/cn';
import { THEMES } from '@/lib/themes';
import type { ThemeName } from '@/lib/types/slide';

interface ThemeSelectorProps {
  value: ThemeName;
  onChange: (theme: ThemeName) => void;
  disabled?: boolean;
}

export function ThemeSelector({ value, onChange, disabled }: ThemeSelectorProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
      {(Object.entries(THEMES) as [ThemeName, (typeof THEMES)[ThemeName]][]).map(
        ([key, theme]) => (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            disabled={disabled}
            className={cn(
              'p-3 rounded-xl border-2 transition-all text-left',
              'hover:translate-x-[-2px] hover:translate-y-[-2px]',
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0',
              value === key
                ? 'border-accent-pink shadow-[2px_2px_0px_0px_#ff90e8]'
                : 'border-border hover:border-border-dark hover:shadow-[2px_2px_0px_0px_#0f0f0f]'
            )}
          >
            {/* Mini slide preview with theme styling */}
            <div
              className="w-full aspect-video rounded-lg mb-2 relative overflow-hidden"
              style={{
                backgroundColor: theme.colors.background,
                border: `${theme.style.border_width} ${theme.style.border_style} ${theme.colors.border_dark}`,
                borderRadius: theme.style.border_radius,
                boxShadow: theme.style.shadow
                  ? theme.style.shadow.includes('rgba')
                    ? theme.style.shadow
                    : `${theme.style.shadow} ${theme.colors.border_dark}`
                  : 'none',
              }}
            >
              {/* Accent bar preview */}
              {theme.style.accent_bar_position !== 'none' && (
                <div
                  className={cn('absolute', {
                    'top-0 left-0 right-0': theme.style.accent_bar_position === 'top',
                    'bottom-0 left-0 right-0': theme.style.accent_bar_position === 'bottom',
                    'top-0 bottom-0 left-0': theme.style.accent_bar_position === 'left',
                  })}
                  style={{
                    backgroundColor: theme.colors.accent,
                    width:
                      theme.style.accent_bar_position === 'left' ? '3px' : '100%',
                    height:
                      theme.style.accent_bar_position === 'top' ||
                      theme.style.accent_bar_position === 'bottom'
                        ? '3px'
                        : '100%',
                  }}
                />
              )}
              {/* Mini text preview */}
              <div className="absolute inset-0 flex flex-col justify-center p-2">
                <div
                  className="h-1.5 rounded-full mb-1"
                  style={{
                    backgroundColor: theme.colors.text_primary,
                    width: '60%',
                    marginLeft: theme.layout.title_alignment === 'center' ? 'auto' : 0,
                    marginRight: theme.layout.title_alignment === 'center' ? 'auto' : 0,
                  }}
                />
                <div
                  className="h-1 rounded-full"
                  style={{
                    backgroundColor: theme.colors.text_secondary,
                    width: '40%',
                    marginLeft: theme.layout.title_alignment === 'center' ? 'auto' : 0,
                    marginRight: theme.layout.title_alignment === 'center' ? 'auto' : 0,
                  }}
                />
              </div>
            </div>
            {/* Theme info */}
            <p
              className="font-semibold text-sm text-text-primary truncate"
              style={{ fontFamily: theme.typography.heading_font.split(',')[0] }}
            >
              {theme.display_name}
            </p>
            <p className="text-xs text-text-muted line-clamp-1">{theme.description}</p>
          </button>
        )
      )}
    </div>
  );
}
