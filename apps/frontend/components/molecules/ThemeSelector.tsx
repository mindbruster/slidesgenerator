"use client";

import { cn } from "@/lib/utils/cn";
import { THEMES } from "@/lib/themes";
import type { ThemeName } from "@/lib/types/slide";

interface ThemeSelectorProps {
  value: ThemeName;
  onChange: (theme: ThemeName) => void;
  disabled?: boolean;
}

export function ThemeSelector({ value, onChange, disabled }: ThemeSelectorProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {(Object.entries(THEMES) as [ThemeName, (typeof THEMES)[ThemeName]][]).map(
        ([key, theme]) => (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            disabled={disabled}
            className={cn(
              "p-3 rounded-xl border-2 transition-all text-left",
              "hover:translate-x-[-2px] hover:translate-y-[-2px]",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0",
              value === key
                ? "border-accent-pink shadow-[2px_2px_0px_0px_#ff90e8]"
                : "border-border hover:border-border-dark hover:shadow-[2px_2px_0px_0px_#0f0f0f]"
            )}
          >
            {/* Color preview swatches */}
            <div className="flex gap-1.5 mb-2">
              <div
                className="w-5 h-5 rounded-full border-2 border-border-dark"
                style={{ backgroundColor: theme.colors.background }}
                title="Background"
              />
              <div
                className="w-5 h-5 rounded-full border-2 border-border-dark"
                style={{ backgroundColor: theme.colors.accent }}
                title="Accent"
              />
              <div
                className="w-5 h-5 rounded-full border-2 border-border-dark"
                style={{ backgroundColor: theme.colors.text_primary }}
                title="Text"
              />
            </div>
            <p className="font-semibold text-sm text-text-primary">
              {theme.display_name}
            </p>
            <p className="text-xs text-text-muted line-clamp-1">
              {theme.description}
            </p>
          </button>
        )
      )}
    </div>
  );
}
