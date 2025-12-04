"use client";

import { useState, useEffect } from "react";
import { Button, TextArea, SlideCountSelector } from "@/components/atoms";
import { Sparkles, X } from "lucide-react";
import type { ThemeName } from "@/lib/types/slide";
import type { Template } from "@/lib/templates";
import { THEMES } from "@/lib/themes";

interface TextInputFormProps {
  onSubmit: (text: string, theme: ThemeName, slideCount: number) => Promise<void>;
  isLoading?: boolean;
  initialTemplate?: Template | null;
  onClearTemplate?: () => void;
}

const DEFAULT_SLIDE_COUNT = 8;

export function TextInputForm({ onSubmit, isLoading, initialTemplate, onClearTemplate }: TextInputFormProps) {
  const [text, setText] = useState("");
  const [theme, setTheme] = useState<ThemeName>("neobrutalism");
  const [slideCount, setSlideCount] = useState(DEFAULT_SLIDE_COUNT);
  const [error, setError] = useState<string | null>(null);

  // Update form when template is selected
  useEffect(() => {
    if (initialTemplate) {
      // Only set template's sample prompt if user hasn't entered their own content
      // Preserve user's content if they've already typed something
      if (text.trim().length === 0) {
        setText(initialTemplate.samplePrompt);
      }
      setTheme(initialTemplate.theme);
      // Also set slide count to template's slide count if reasonable
      const templateSlideCount = initialTemplate.slides.length;
      if (templateSlideCount >= 5 && templateSlideCount <= 15) {
        setSlideCount(templateSlideCount);
      }
    }
  }, [initialTemplate?.id]); // Use id for more reliable change detection

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (text.trim().length < 50) {
      setError("Please enter at least 50 characters to generate meaningful slides.");
      return;
    }

    try {
      await onSubmit(text, theme, slideCount);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  const charCount = text.length;
  const minChars = 50;
  const isValid = charCount >= minChars;

  const handleClearTemplate = () => {
    setText("");
    setTheme("neobrutalism");
    onClearTemplate?.();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
      <div className="space-y-6">
        {/* Template indicator with theme info */}
        {initialTemplate && (
          <div className="flex items-center justify-between p-4 bg-accent-pink-light rounded-xl border-2 border-accent-pink">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-sm font-medium text-text-primary">
                  Using template: <span className="font-bold">{initialTemplate.title}</span>
                </p>
                <p className="text-xs text-text-secondary mt-0.5">
                  {initialTemplate.description}
                </p>
              </div>
              {/* Theme badge */}
              <div
                className="px-3 py-1 rounded-lg text-xs font-semibold"
                style={{
                  backgroundColor: THEMES[initialTemplate.theme].colors.accent + '20',
                  color: THEMES[initialTemplate.theme].colors.accent,
                  border: `1px solid ${THEMES[initialTemplate.theme].colors.accent}`,
                }}
              >
                {THEMES[initialTemplate.theme].display_name} Theme
              </div>
            </div>
            <button
              type="button"
              onClick={handleClearTemplate}
              className="p-1.5 rounded-lg hover:bg-white/50 transition-colors"
              aria-label="Clear template"
            >
              <X className="w-4 h-4 text-text-secondary" />
            </button>
          </div>
        )}

        {/* Slide count selector */}
        <div>
          <label className="block text-sm font-semibold text-text-primary mb-3">
            Number of slides
          </label>
          <SlideCountSelector
            value={slideCount}
            onChange={setSlideCount}
            disabled={isLoading}
          />
        </div>

        {/* Text input */}
        <TextArea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your content here... an essay, article, notes, or just describe what you want to present."
          className="min-h-[300px]"
          error={error || undefined}
          disabled={isLoading}
        />

        <div className="flex items-center justify-between">
          <div className="text-sm text-text-secondary">
            <span className={isValid ? "text-success" : "text-text-muted"}>
              {charCount}
            </span>
            <span className="text-text-muted"> / {minChars} min characters</span>
          </div>

          <Button
            type="submit"
            size="lg"
            isLoading={isLoading}
            disabled={!isValid}
          >
            <Sparkles className="h-5 w-5" />
            Generate Slides
          </Button>
        </div>
      </div>
    </form>
  );
}
