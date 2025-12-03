import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/atoms";
import { cn } from "@/lib/utils/cn";

interface PricingCardProps {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  ctaText: string;
  ctaHref: string;
  isPopular?: boolean;
}

export function PricingCard({
  name,
  price,
  period = "/month",
  description,
  features,
  ctaText,
  ctaHref,
  isPopular = false,
}: PricingCardProps) {
  return (
    <div
      className={cn(
        "relative bg-bg-white border-2 border-border-dark rounded-2xl p-8 transition-all",
        isPopular
          ? "shadow-[6px_6px_0px_0px_#ff90e8] -translate-x-1 -translate-y-1"
          : "shadow-[4px_4px_0px_0px_#0f0f0f]"
      )}
    >
      {/* Popular badge */}
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="px-4 py-1 bg-accent-pink text-text-primary text-sm font-bold rounded-full border-2 border-border-dark">
            Most popular
          </span>
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-text-primary mb-2">{name}</h3>
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-4xl font-black text-text-primary">{price}</span>
          {price !== "Free" && (
            <span className="text-text-secondary">{period}</span>
          )}
        </div>
        <p className="mt-3 text-text-secondary text-sm">{description}</p>
      </div>

      {/* Features list */}
      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-accent-pink-light flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check className="w-3 h-3 text-text-primary" />
            </div>
            <span className="text-text-primary text-sm">{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Link href={ctaHref} className="block">
        <Button
          variant={isPopular ? "primary" : "secondary"}
          className="w-full"
          size="lg"
        >
          {ctaText}
        </Button>
      </Link>
    </div>
  );
}
