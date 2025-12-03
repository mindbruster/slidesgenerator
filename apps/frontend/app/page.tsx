"use client";

import { useRouter } from "next/navigation";
import { TextInputForm } from "@/components/molecules";
import { Spinner } from "@/components/atoms";
import { useSlides } from "@/contexts/SlidesContext";
import { Layers, Sparkles, Edit3, Download } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const { state, generateSlides } = useSlides();

  const handleSubmit = async (text: string) => {
    await generateSlides(text);
    router.push("/presentation");
  };

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-accent-pink rounded-full opacity-60 blur-xl" />
        <div className="absolute top-40 right-20 w-32 h-32 bg-accent-pink rounded-full opacity-40 blur-2xl" />
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-accent-pink-light rounded-full opacity-50 blur-xl" />

        <div className="relative max-w-5xl mx-auto px-4 pt-16 pb-8">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-12">
            <div className="w-12 h-12 bg-bg-dark rounded-xl flex items-center justify-center shadow-[2px_2px_0px_0px_#ff90e8]">
              <Layers className="w-6 h-6 text-text-inverse" />
            </div>
            <span className="text-2xl font-bold text-text-primary">Decksnap</span>
          </div>

          {/* Headline */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-text-primary mb-6 leading-tight">
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
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Paste any text and get a polished, presentation-ready slide deck in seconds.
              No design skills needed.
            </p>
          </div>

          {/* Input Form */}
          {state.isGenerating ? (
            <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
              <Spinner size="lg" />
              <p className="mt-6 text-lg text-text-secondary">
                Creating your presentation...
              </p>
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

      {/* Features Section */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-6">
          <FeatureCard
            icon={<Sparkles className="w-6 h-6" />}
            title="One-click magic"
            description="No configuration needed. Paste your content, click generate, done."
          />
          <FeatureCard
            icon={<Edit3 className="w-6 h-6" />}
            title="Edit directly"
            description="Click any text on your slides to edit. No regeneration loops."
          />
          <FeatureCard
            icon={<Download className="w-6 h-6" />}
            title="Export anywhere"
            description="Download as PDF or share with a link. Ready to present."
          />
        </div>
      </div>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-bg-white border-2 border-border-dark rounded-2xl p-6 shadow-[2px_2px_0px_0px_#0f0f0f] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_#0f0f0f] transition-all">
      <div className="w-12 h-12 bg-accent-pink-light rounded-xl flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-text-primary mb-2">{title}</h3>
      <p className="text-text-secondary">{description}</p>
    </div>
  );
}
