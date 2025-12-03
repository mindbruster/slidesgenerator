"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { TextInputForm } from "@/components/molecules";
import { AgentProgress } from "@/components/organisms/agent";
import { useSlides } from "@/contexts/SlidesContext";
import { Layers } from "lucide-react";

export default function AppPage() {
  const router = useRouter();
  const { state, generateSlides } = useSlides();

  const isComplete = state.agentEvents.some((e) => e.type === "complete");

  // Navigate to presentation when generation completes
  useEffect(() => {
    if (isComplete && state.presentation) {
      const timer = setTimeout(() => {
        router.push("/presentation");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isComplete, state.presentation, router]);

  const handleSubmit = async (text: string) => {
    await generateSlides(text);
  };

  return (
    <main className="min-h-[calc(100vh-64px)]">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-accent-pink rounded-full opacity-60 blur-xl" />
        <div className="absolute top-40 right-20 w-32 h-32 bg-accent-pink rounded-full opacity-40 blur-2xl" />
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-accent-pink-light rounded-full opacity-50 blur-xl" />

        <div className="relative max-w-5xl mx-auto px-4 pt-12 pb-8">
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

          {/* Input Form */}
          {state.isGenerating || state.agentEvents.length > 0 ? (
            <div className="py-8 animate-fade-in">
              <AgentProgress events={state.agentEvents} isComplete={isComplete} />
            </div>
          ) : (
            <div className="animate-slide-up">
              <TextInputForm onSubmit={handleSubmit} isLoading={state.isGenerating} />
            </div>
          )}

          {/* Error message */}
          {state.error && (
            <div className="mt-6 p-4 bg-red-50 border-2 border-error rounded-xl text-center">
              <p className="text-error">{state.error}</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
