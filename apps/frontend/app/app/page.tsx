"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { TextInputForm } from "@/components/molecules";
import { AgentProgress } from "@/components/organisms/agent";
import { TemplateGallery } from "@/components/organisms/templates";
import { useSlides } from "@/contexts/SlidesContext";
import { Layers } from "lucide-react";
import type { ThemeName } from "@/lib/types/slide";
import type { Template } from "@/lib/templates";

export default function AppPage() {
  const router = useRouter();
  const { state, generateSlides } = useSlides();
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isGalleryCollapsed, setIsGalleryCollapsed] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const { state, generateSlides, generateFromFile } = useSlides();

  const isComplete = state.agentEvents.some((e) => e.type === "complete");
  const isGenerating = state.isGenerating || state.agentEvents.length > 0;

  // Navigate to presentation when generation completes
  useEffect(() => {
    if (isComplete && state.presentation) {
      const timer = setTimeout(() => {
        router.push("/presentation");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isComplete, state.presentation, router]);

  const handleSubmit = async (text: string, theme: ThemeName, slideCount: number) => {
    await generateSlides(text, theme, slideCount);
  };

  const handleSelectTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setIsGalleryCollapsed(true); // Auto-collapse gallery when template is selected
    // Scroll to form
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleClearTemplate = () => {
    setSelectedTemplate(null);
    setIsGalleryCollapsed(false); // Expand gallery when template is cleared
  };

  const handleFileSubmit = async (file: File, theme: ThemeName) => {
    await generateFromFile(file, theme);
  };

  return (
    <main className="min-h-[calc(100vh-64px)]">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-accent-pink rounded-full opacity-60 blur-xl" />
        <div className="absolute top-40 right-20 w-32 h-32 bg-accent-pink rounded-full opacity-40 blur-2xl" />
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-accent-pink-light rounded-full opacity-50 blur-xl" />

        {/* Content */}
        {isGenerating ? (
          /* Generation Progress - Full width layout */
          <div className="relative px-4 py-8 animate-fade-in">
            <AgentProgress events={state.agentEvents} isComplete={isComplete} theme={state.currentTheme} />
          </div>
        ) : (
          <div className="relative">
            {/* Hero header */}
            <div className="max-w-5xl mx-auto px-4 pt-12 pb-8">
              {/* Logo */}
              <div className="flex items-center justify-center gap-3 mb-10">
                <div className="w-12 h-12 bg-bg-dark rounded-xl flex items-center justify-center shadow-[2px_2px_0px_0px_#ff90e8]">
                  <Layers className="w-6 h-6 text-text-inverse" />
                </div>
                <span className="text-2xl font-bold text-text-primary">Decksnap</span>
              </div>

              {/* Headline */}
              <div className="text-center mb-10">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary mb-5 leading-tight">
                  Turn any idea into
                  <br />
                  <span className="relative">
                    beautiful slides
                    <svg
                      className="absolute -bottom-2 left-0 w-full"
                      viewBox="0 0 300 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2 10C50 4 150 2 298 6"
                        stroke="#ff90e8"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </h1>
                <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                  Paste any text and get a polished, presentation-ready slide deck in seconds.
                  No design skills needed.
                </p>
              </div>
            </div>

            {/* Template Gallery */}
            <div className="max-w-7xl mx-auto px-4 pb-8">
              <TemplateGallery
                onSelectTemplate={handleSelectTemplate}
                isCollapsed={isGalleryCollapsed}
                onToggleCollapse={() => setIsGalleryCollapsed(!isGalleryCollapsed)}
            {/* Input Form */}
            <div className="animate-slide-up">
              <TextInputForm
                onSubmit={handleSubmit}
                onFileSubmit={handleFileSubmit}
                isLoading={state.isGenerating}
              />
            </div>

            {/* Divider - only show when no template selected */}
            {!selectedTemplate && (
              <div className="max-w-5xl mx-auto px-4">
                <div className="flex items-center gap-4 mb-8">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-sm text-text-muted font-medium">or create from scratch</span>
                  <div className="flex-1 h-px bg-border" />
                </div>
              </div>
            )}

            {/* Input Form */}
            <div ref={formRef} className="max-w-5xl mx-auto px-4 pb-12">
              <div className="animate-slide-up">
                <TextInputForm
                  onSubmit={handleSubmit}
                  isLoading={state.isGenerating}
                  initialTemplate={selectedTemplate}
                  onClearTemplate={handleClearTemplate}
                />
              </div>

              {/* Error message */}
              {state.error && (
                <div className="mt-6 p-4 bg-red-50 border-2 border-error rounded-xl text-center">
                  <p className="text-error">{state.error}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
