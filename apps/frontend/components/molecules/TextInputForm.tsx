"use client";

import { useState, useEffect } from "react";
import { Button, TextArea, SlideCountSelector } from "@/components/atoms";
import { Sparkles, X } from "lucide-react";
import { useState, useRef } from "react";
import { Button, TextArea } from "@/components/atoms";
import { ThemeSelector } from "./ThemeSelector";
import { Sparkles, Upload, X, FileText } from "lucide-react";
import type { ThemeName } from "@/lib/types/slide";
import type { Template } from "@/lib/templates";
import { THEMES } from "@/lib/themes";

const ALLOWED_FILE_TYPES = [".pdf", ".docx", ".txt", ".md"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

    // File upload mode
    if (selectedFile && onFileSubmit) {
      try {
        await onFileSubmit(selectedFile, theme);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      }
      return;
    }

    // Text mode
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const ext = "." + file.name.split(".").pop()?.toLowerCase();
    if (!ALLOWED_FILE_TYPES.includes(ext)) {
      setError(`Invalid file type. Allowed: ${ALLOWED_FILE_TYPES.join(", ")}`);
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError("File too large. Maximum size is 10MB.");
      return;
    }

    setError(null);
    setSelectedFile(file);
    setText(""); // Clear text when file is selected
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    if (selectedFile) {
      setSelectedFile(null); // Clear file when text is entered
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const charCount = text.length;
  const minChars = 50;
  const isTextValid = charCount >= minChars;
  const isValid = selectedFile || isTextValid;

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

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

        {/* File upload section */}
        {onFileSubmit && (
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-3">
              Upload a document (optional)
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept={ALLOWED_FILE_TYPES.join(",")}
              onChange={handleFileSelect}
              className="hidden"
              disabled={isLoading}
            />

            {selectedFile ? (
              <div className="flex items-center gap-3 p-4 bg-bg-secondary border-2 border-border rounded-xl">
                <FileText className="h-8 w-8 text-accent-pink flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-text-primary truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-sm text-text-muted">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  disabled={isLoading}
                  className="p-2 hover:bg-bg-tertiary rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-text-muted" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="w-full p-6 border-2 border-dashed border-border rounded-xl hover:border-accent-pink hover:bg-bg-secondary transition-colors"
              >
                <div className="flex flex-col items-center gap-2 text-text-muted">
                  <Upload className="h-8 w-8" />
                  <span className="font-medium">Click to upload</span>
                  <span className="text-sm">PDF, DOCX, TXT, MD (max 10MB)</span>
                </div>
              </button>
            )}
          </div>
        )}

        {/* Divider */}
        {onFileSubmit && (
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-sm text-text-muted font-medium">or paste text</span>
            <div className="flex-1 h-px bg-border" />
          </div>
        )}

        {/* Text input */}
        <TextArea
          value={text}
          onChange={handleTextChange}
          placeholder="Paste your content here... an essay, article, notes, or just describe what you want to present."
          className="min-h-[300px]"
          error={error || undefined}
          disabled={isLoading || !!selectedFile}
        />

        <div className="flex items-center justify-between">
          <div className="text-sm text-text-secondary">
            {selectedFile ? (
              <span className="text-success">File ready to upload</span>
            ) : (
              <>
                <span className={isTextValid ? "text-success" : "text-text-muted"}>
                  {charCount}
                </span>
                <span className="text-text-muted"> / {minChars} min characters</span>
              </>
            )}
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
