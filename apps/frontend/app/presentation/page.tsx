"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/atoms";
import { SlidePreview, SlideCarousel } from "@/components/organisms";
import { useSlides } from "@/contexts/SlidesContext";
import { SlidesRepository } from "@/lib/api/repositories";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Download,
  Share2,
  Layers,
} from "lucide-react";

export default function PresentationPage() {
  const router = useRouter();
  const {
    state,
    currentSlide,
    totalSlides,
    setCurrentSlide,
    nextSlide,
    previousSlide,
    updateSlide,
  } = useSlides();

  // Redirect if no presentation
  useEffect(() => {
    if (!state.presentation && !state.isGenerating) {
      router.push("/");
    }
  }, [state.presentation, state.isGenerating, router]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        nextSlide();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        previousSlide();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, previousSlide]);

  const handleExportPdf = useCallback(() => {
    if (!state.presentation) return;
    const url = SlidesRepository.getPdfUrl(state.presentation.id);
    window.open(url, "_blank");
  }, [state.presentation]);

  const handleShare = useCallback(async () => {
    if (!state.presentation) return;
    try {
      const { url } = await SlidesRepository.createShareLink(state.presentation.id);
      // Copy to clipboard
      await navigator.clipboard.writeText(window.location.origin + url);
      alert("Share link copied to clipboard!");
    } catch (error) {
      console.error("Failed to create share link:", error);
    }
  }, [state.presentation]);

  const handleUpdateSlide = useCallback(
    (field: string, value: string) => {
      if (!currentSlide) return;
      updateSlide(state.currentSlideIndex, { [field]: value });
    },
    [currentSlide, state.currentSlideIndex, updateSlide]
  );

  const handleUpdateBullet = useCallback(
    (bulletIndex: number, value: string) => {
      if (!currentSlide?.bullets) return;
      const newBullets = [...currentSlide.bullets];
      newBullets[bulletIndex] = value;
      updateSlide(state.currentSlideIndex, { bullets: newBullets });
    },
    [currentSlide, state.currentSlideIndex, updateSlide]
  );

  if (!state.presentation) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-bg-cream">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-bg-white border-b-2 border-border-dark">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-accent-pink" />
            <h1 className="font-bold text-text-primary truncate max-w-[200px] md:max-w-none">
              {state.presentation.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {state.isSaving && (
            <span className="text-sm text-text-muted">Saving...</span>
          )}
          <Button variant="secondary" size="sm" onClick={handleShare}>
            <Share2 className="w-4 h-4" />
            <span className="hidden md:inline">Share</span>
          </Button>
          <Button variant="primary" size="sm" onClick={handleExportPdf}>
            <Download className="w-4 h-4" />
            <span className="hidden md:inline">Export PDF</span>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Slide Preview Area */}
        <div className="flex-1 flex items-center justify-center p-4 md:p-8">
          <div className="w-full max-w-5xl">
            {currentSlide && (
              <SlidePreview
                slide={currentSlide}
                onEditTitle={(v) => handleUpdateSlide("title", v)}
                onEditSubtitle={(v) => handleUpdateSlide("subtitle", v)}
                onEditBody={(v) => handleUpdateSlide("body", v)}
                onEditQuote={(v) => handleUpdateSlide("quote", v)}
                onEditAttribution={(v) => handleUpdateSlide("attribution", v)}
                onEditBullet={handleUpdateBullet}
                isEditable={true}
              />
            )}
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-center gap-4 pb-4">
          <Button
            variant="secondary"
            size="icon"
            onClick={previousSlide}
            disabled={state.currentSlideIndex === 0}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          <span className="text-sm font-medium text-text-secondary min-w-[80px] text-center">
            {state.currentSlideIndex + 1} / {totalSlides}
          </span>

          <Button
            variant="secondary"
            size="icon"
            onClick={nextSlide}
            disabled={state.currentSlideIndex === totalSlides - 1}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Slide Carousel */}
        <SlideCarousel
          slides={state.presentation.slides}
          currentIndex={state.currentSlideIndex}
          onSlideSelect={setCurrentSlide}
        />
      </main>
    </div>
  );
}
