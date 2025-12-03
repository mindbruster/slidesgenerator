"use client";

import { useState } from "react";
import { Button, TextArea } from "@/components/atoms";
import { ThemeSelector } from "./ThemeSelector";
import { Sparkles } from "lucide-react";
import type { ThemeName } from "@/lib/types/slide";

interface TextInputFormProps {
  onSubmit: (text: string, theme: ThemeName) => Promise<void>;
  isLoading?: boolean;
}

export function TextInputForm({ onSubmit, isLoading }: TextInputFormProps) {
  const [text, setText] = useState("");
  const [theme, setTheme] = useState<ThemeName>("neobrutalism");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (text.trim().length < 50) {
      setError("Please enter at least 50 characters to generate meaningful slides.");
      return;
    }

    try {
      await onSubmit(text, theme);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  const charCount = text.length;
  const minChars = 50;
  const isValid = charCount >= minChars;

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
      <div className="space-y-6">
        {/* Theme selector */}
        <div>
          <label className="block text-sm font-semibold text-text-primary mb-3">
            Choose a theme
          </label>
          <ThemeSelector
            value={theme}
            onChange={setTheme}
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
