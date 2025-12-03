"use client";

import { cn } from "@/lib/utils/cn";
import type { Slide } from "@/lib/types";

interface SlidePreviewProps {
  slide: Slide;
  onEditTitle?: (value: string) => void;
  onEditSubtitle?: (value: string) => void;
  onEditBody?: (value: string) => void;
  onEditBullet?: (index: number, value: string) => void;
  onEditQuote?: (value: string) => void;
  onEditAttribution?: (value: string) => void;
  isEditable?: boolean;
}

export function SlidePreview({
  slide,
  onEditTitle,
  onEditSubtitle,
  onEditBody,
  onEditBullet,
  onEditQuote,
  onEditAttribution,
  isEditable = true,
}: SlidePreviewProps) {
  const layoutClasses = {
    left: "items-start text-left",
    center: "items-center text-center",
    right: "items-end text-right",
    split: "items-start text-left",
  };

  const EditableText = ({
    value,
    onChange,
    className,
    as: Component = "p",
    placeholder = "Click to edit...",
  }: {
    value: string | null | undefined;
    onChange?: (value: string) => void;
    className?: string;
    as?: "h1" | "h2" | "p" | "span" | "blockquote";
    placeholder?: string;
  }) => {
    if (!isEditable || !onChange) {
      return <Component className={className}>{value || placeholder}</Component>;
    }

    return (
      <Component
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) => onChange(e.currentTarget.textContent || "")}
        className={cn(
          className,
          "outline-none",
          "focus:bg-accent-pink-light focus:ring-2 focus:ring-accent-pink focus:ring-offset-2",
          "rounded px-1 -mx-1",
          "cursor-text"
        )}
      >
        {value || placeholder}
      </Component>
    );
  };

  return (
    <div className="w-full aspect-video bg-bg-cream rounded-2xl border-2 border-border-dark shadow-[4px_4px_0px_0px_#0f0f0f] overflow-hidden">
      <div
        className={cn(
          "h-full p-12 md:p-16 lg:p-20 flex flex-col justify-center",
          layoutClasses[slide.layout]
        )}
      >
        {/* Title Slide */}
        {slide.type === "title" && (
          <div className={cn("max-w-4xl", layoutClasses[slide.layout])}>
            <EditableText
              as="h1"
              value={slide.title}
              onChange={onEditTitle}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary leading-tight"
              placeholder="Presentation Title"
            />
            {(slide.subtitle || isEditable) && (
              <EditableText
                as="p"
                value={slide.subtitle}
                onChange={onEditSubtitle}
                className="mt-4 text-xl md:text-2xl text-text-secondary"
                placeholder="Subtitle"
              />
            )}
          </div>
        )}

        {/* Content Slide */}
        {slide.type === "content" && (
          <div className={cn("max-w-4xl w-full", layoutClasses[slide.layout])}>
            {(slide.title || isEditable) && (
              <EditableText
                as="h2"
                value={slide.title}
                onChange={onEditTitle}
                className="text-3xl md:text-4xl font-bold text-text-primary mb-6"
                placeholder="Slide Title"
              />
            )}
            {(slide.body || isEditable) && (
              <EditableText
                as="p"
                value={slide.body}
                onChange={onEditBody}
                className="text-lg md:text-xl text-text-primary leading-relaxed"
                placeholder="Add content here..."
              />
            )}
          </div>
        )}

        {/* Bullets Slide */}
        {slide.type === "bullets" && (
          <div className="max-w-4xl w-full">
            {(slide.title || isEditable) && (
              <EditableText
                as="h2"
                value={slide.title}
                onChange={onEditTitle}
                className="text-3xl md:text-4xl font-bold text-text-primary mb-8"
                placeholder="Slide Title"
              />
            )}
            <ul className="space-y-4">
              {slide.bullets?.map((bullet, i) => (
                <li key={i} className="flex items-start gap-4">
                  <span className="w-3 h-3 mt-2 bg-accent-pink rounded-full flex-shrink-0" />
                  <EditableText
                    as="span"
                    value={bullet}
                    onChange={onEditBullet ? (v) => onEditBullet(i, v) : undefined}
                    className="text-lg md:text-xl text-text-primary"
                    placeholder="Bullet point"
                  />
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Quote Slide */}
        {slide.type === "quote" && (
          <div className={cn("max-w-3xl", layoutClasses[slide.layout])}>
            <div className="relative">
              <span className="absolute -left-8 -top-4 text-6xl text-accent-pink opacity-50">
                &ldquo;
              </span>
              <EditableText
                as="blockquote"
                value={slide.quote}
                onChange={onEditQuote}
                className="text-2xl md:text-3xl lg:text-4xl text-text-primary italic leading-relaxed"
                placeholder="Enter quote..."
              />
            </div>
            {(slide.attribution || isEditable) && (
              <EditableText
                as="p"
                value={slide.attribution ? `— ${slide.attribution}` : undefined}
                onChange={onEditAttribution}
                className="mt-6 text-lg text-text-secondary"
                placeholder="— Attribution"
              />
            )}
          </div>
        )}

        {/* Section Slide */}
        {slide.type === "section" && (
          <div className="text-center">
            <div className="w-16 h-1 bg-accent-pink mx-auto mb-8" />
            <EditableText
              as="h2"
              value={slide.title}
              onChange={onEditTitle}
              className="text-4xl md:text-5xl font-bold text-text-primary"
              placeholder="Section Title"
            />
          </div>
        )}
      </div>
    </div>
  );
}
