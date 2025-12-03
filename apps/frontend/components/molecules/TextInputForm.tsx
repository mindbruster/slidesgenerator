"use client";

import { useState } from "react";
import { Button, TextArea } from "@/components/atoms";
import { Sparkles } from "lucide-react";

interface TextInputFormProps {
  onSubmit: (text: string) => Promise<void>;
  isLoading?: boolean;
}

export function TextInputForm({ onSubmit, isLoading }: TextInputFormProps) {
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (text.trim().length < 50) {
      setError("Please enter at least 50 characters to generate meaningful slides.");
      return;
    }

    try {
      await onSubmit(text);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  const charCount = text.length;
  const minChars = 50;
  const isValid = charCount >= minChars;

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
      <div className="space-y-4">
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
