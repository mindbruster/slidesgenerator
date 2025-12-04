"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { TextInputForm } from "@/components/molecules";
import { AgentProgress } from "@/components/organisms/agent";
import { TemplateSidebar } from "@/components/organisms/templates";
import { useSlides } from "@/contexts/SlidesContext";
import type { ThemeName } from "@/lib/types/slide";
import type { Template } from "@/lib/templates";

export default function AppPage() {
  const router = useRouter();
  const { state, generateSlides, generateFromFile, startNewPresentation, updateAgentEventSlide, syncAgentEditsToPresentation, changeTheme } = useSlides();
  const [lastInputText, setLastInputText] = useState<string>("");
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  const isComplete = state.agentEvents.some((e) => e.type === "complete");
  const isGenerating = state.isGenerating || state.agentEvents.length > 0;

  const handleViewPresentation = () => {
    if (state.presentation) {
      router.push("/presentation");
    }
  };

  const handleSubmit = async (text: string, theme: ThemeName, slideCount: number) => {
    setLastInputText(text);
    await generateSlides(text, theme, slideCount);
  };

  const handleRegenerate = useCallback(async (theme: ThemeName) => {
    // Build content from the current agent events (which may have been edited)
    const slideEvents = state.agentEvents.filter(
      (e) => e.type === "tool_call" && e.tool === "add_slide"
    );

    // Create a text summary from the edited slide content
    const editedContent = slideEvents
      .map((event) => {
        const args = event.args || {};
        let content = args.title ? `${args.title}` : "";
        if (args.subtitle) content += `\n${args.subtitle}`;
        if (args.body) content += `\n${args.body}`;
        if (args.bullets && Array.isArray(args.bullets)) {
          content += `\n${(args.bullets as string[]).join("\n")}`;
        }
        if (args.quote) content += `\n"${args.quote}"`;
        if (args.attribution) content += ` - ${args.attribution}`;
        return content;
      })
      .filter(Boolean)
      .join("\n\n");

    // Use the edited content or fall back to the original input
    const textToUse = editedContent || lastInputText;

    await generateSlides(textToUse, theme, state.requestedSlideCount || slideEvents.length);
  }, [state.agentEvents, state.requestedSlideCount, lastInputText, generateSlides]);

  const handleSelectTemplate = (template: Template) => {
    setSelectedTemplate(template);
  };

  const handleClearTemplate = () => {
    setSelectedTemplate(null);
  };

  const handleFileSubmit = async (file: File, theme: ThemeName, slideCount: number) => {
    await generateFromFile(file, theme, slideCount);
  };

  return (
    <main className="h-[calc(100vh-64px)] flex">
      {/* Template Sidebar - only show when not generating */}
      {!isGenerating && (
        <TemplateSidebar
          onSelectTemplate={handleSelectTemplate}
          selectedTemplate={selectedTemplate}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="relative min-h-full">
          {/* Decorative elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-accent-pink rounded-full opacity-60 blur-xl" />
          <div className="absolute top-40 right-20 w-32 h-32 bg-accent-pink rounded-full opacity-40 blur-2xl" />
          <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-accent-pink-light rounded-full opacity-50 blur-xl" />

          {/* Content */}
          {isGenerating ? (
            /* Generation Progress */
            <div className="relative px-4 py-8 animate-fade-in">
              <AgentProgress
                events={state.agentEvents}
                isComplete={isComplete}
                theme={state.currentTheme}
                totalSlides={state.requestedSlideCount || undefined}
                onViewPresentation={handleViewPresentation}
                onCreateNew={startNewPresentation}
                onUpdateSlide={updateAgentEventSlide}
                onRegenerate={handleRegenerate}
                onSyncEdits={syncAgentEditsToPresentation}
                onChangeTheme={changeTheme}
              />
            </div>
          ) : (
            <div className="relative">
              {/* Hero header */}
              <div className="max-w-4xl mx-auto px-6 pt-12 pb-8">
                {/* Headline */}
                <div className="text-center mb-10">
                  <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-5 leading-tight">
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

              {/* Input Form */}
              <div className="max-w-4xl mx-auto px-6 pb-12">
                <div className="animate-slide-up">
                  <TextInputForm
                    onSubmit={handleSubmit}
                    onFileSubmit={handleFileSubmit}
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
      </div>
    </main>
  );
}
