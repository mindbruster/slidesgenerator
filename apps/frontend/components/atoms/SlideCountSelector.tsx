"use client";

import { cn } from "@/lib/utils/cn";
import { Minus, Plus } from "lucide-react";

const MIN_SLIDES = 5;
const MAX_SLIDES = 15;

export interface SlideCountSelectorProps {
  value: number;
  onChange: (count: number) => void;
  disabled?: boolean;
}

export function SlideCountSelector({
  value,
  onChange,
  disabled,
}: SlideCountSelectorProps) {
  const handleDecrement = () => {
    if (value > MIN_SLIDES) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < MAX_SLIDES) {
      onChange(value + 1);
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseInt(e.target.value, 10));
  };

  const percentage = ((value - MIN_SLIDES) / (MAX_SLIDES - MIN_SLIDES)) * 100;

  return (
    <div className={cn("space-y-4", disabled && "opacity-50 pointer-events-none")}>
      {/* Stepper with value display */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Decrement button */}
          <button
            type="button"
            onClick={handleDecrement}
            disabled={disabled || value <= MIN_SLIDES}
            className={cn(
              "w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-all duration-200",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-pink focus-visible:ring-offset-2",
              value <= MIN_SLIDES
                ? "border-border-light text-text-muted cursor-not-allowed"
                : "border-border-dark bg-bg-white text-text-primary hover:bg-bg-tertiary hover:shadow-[2px_2px_0px_0px_#0f0f0f] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
            )}
          >
            <Minus className="w-4 h-4" />
          </button>

          {/* Value display */}
          <div className="w-20 h-12 rounded-xl border-2 border-border-dark bg-bg-white flex items-center justify-center shadow-[2px_2px_0px_0px_#ff90e8]">
            <span className="text-2xl font-bold text-text-primary">{value}</span>
          </div>

          {/* Increment button */}
          <button
            type="button"
            onClick={handleIncrement}
            disabled={disabled || value >= MAX_SLIDES}
            className={cn(
              "w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-all duration-200",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-pink focus-visible:ring-offset-2",
              value >= MAX_SLIDES
                ? "border-border-light text-text-muted cursor-not-allowed"
                : "border-border-dark bg-bg-white text-text-primary hover:bg-bg-tertiary hover:shadow-[2px_2px_0px_0px_#0f0f0f] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
            )}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Range labels */}
        <div className="text-sm text-text-muted">
          {MIN_SLIDES} - {MAX_SLIDES} slides
        </div>
      </div>

      {/* Slider */}
      <div className="relative">
        {/* Track background */}
        <div className="h-3 bg-bg-tertiary rounded-full border-2 border-border-light overflow-hidden">
          {/* Filled track */}
          <div
            className="h-full bg-accent-pink rounded-full transition-all duration-150"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Native range input (invisible, for interaction) */}
        <input
          type="range"
          min={MIN_SLIDES}
          max={MAX_SLIDES}
          value={value}
          onChange={handleSliderChange}
          disabled={disabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />

        {/* Custom thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-bg-white border-2 border-border-dark rounded-full shadow-[2px_2px_0px_0px_#0f0f0f] transition-all duration-150 pointer-events-none"
          style={{ left: `calc(${percentage}% - 12px)` }}
        >
          <div className="absolute inset-1 bg-accent-pink rounded-full" />
        </div>

        {/* Tick marks */}
        <div className="flex justify-between mt-2 px-1">
          {Array.from({ length: MAX_SLIDES - MIN_SLIDES + 1 }, (_, i) => MIN_SLIDES + i).map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => onChange(num)}
              disabled={disabled}
              className={cn(
                "w-1 h-1 rounded-full transition-colors",
                num === value ? "bg-accent-pink" : "bg-border-light hover:bg-border-dark"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
