import Link from "next/link";
import { PricingCard } from "@/components/molecules";
import { Button } from "@/components/atoms";
import { ArrowRight, Zap } from "lucide-react";

const FREE_FEATURES = [
  "3 presentations per month",
  "Up to 10 slides per deck",
  "Basic slide layouts",
  "PDF export (with watermark)",
  "Community support",
];

const PRO_FEATURES = [
  "Unlimited presentations",
  "Up to 30 slides per deck",
  "All premium layouts",
  "Clean PDF export",
  "Priority AI generation",
  "Edit history & versioning",
  "Priority email support",
];

export default function PricingPage() {
  return (
    <main className="min-h-[calc(100vh-64px)]">
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 right-[10%] w-48 h-48 bg-accent-pink rounded-full opacity-30 blur-3xl" />
        <div className="absolute bottom-0 left-[15%] w-64 h-64 bg-accent-pink-light rounded-full opacity-40 blur-3xl" />

        <div className="relative max-w-5xl mx-auto px-4">
          {/* Badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-bg-white border-2 border-border-dark rounded-full shadow-[2px_2px_0px_0px_#0f0f0f]">
              <Zap className="w-4 h-4 text-accent-pink" />
              <span className="text-sm font-semibold text-text-primary">Simple pricing</span>
            </div>
          </div>

          {/* Headline */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-text-primary mb-6 leading-tight">
              Start free.{" "}
              <span className="relative inline-block">
                Upgrade when ready
                <svg
                  className="absolute -bottom-1 md:-bottom-2 left-0 w-full"
                  viewBox="0 0 400 12"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M2 8C80 4 200 4 398 10"
                    stroke="#ff90e8"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>
            <p className="text-xl text-text-secondary max-w-xl mx-auto">
              No credit card required. No commitment. Just start creating presentations.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <PricingCard
              name="Free"
              price="Free"
              description="Perfect for trying out Decksnap"
              features={FREE_FEATURES}
              ctaText="Get started"
              ctaHref="/app"
            />
            <PricingCard
              name="Pro"
              price="$9"
              description="For power users and teams"
              features={PRO_FEATURES}
              ctaText="Upgrade to Pro"
              ctaHref="/app"
              isPopular
            />
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-text-primary text-center mb-12">
            Compare plans
          </h2>

          <div className="bg-bg-white border-2 border-border-dark rounded-2xl shadow-[4px_4px_0px_0px_#0f0f0f] overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-border-dark bg-bg-cream">
                  <th className="text-left py-4 px-6 font-semibold text-text-primary">Feature</th>
                  <th className="text-center py-4 px-6 font-semibold text-text-primary">Free</th>
                  <th className="text-center py-4 px-6 font-semibold text-text-primary bg-accent-pink-light">Pro</th>
                </tr>
              </thead>
              <tbody>
                <ComparisonRow feature="Presentations/month" free="3" pro="Unlimited" />
                <ComparisonRow feature="Slides per deck" free="10" pro="30" />
                <ComparisonRow feature="PDF export" free="Watermarked" pro="Clean" />
                <ComparisonRow feature="Premium layouts" free="—" pro="✓" isCheck />
                <ComparisonRow feature="Priority generation" free="—" pro="✓" isCheck />
                <ComparisonRow feature="Edit history" free="—" pro="✓" isCheck />
                <ComparisonRow feature="Support" free="Community" pro="Priority email" />
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Teaser */}
      <section className="py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="bg-bg-cream border-2 border-border-dark rounded-2xl p-8 md:p-12 shadow-[4px_4px_0px_0px_#0f0f0f]">
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-4">
              Got questions?
            </h2>
            <p className="text-lg text-text-secondary mb-6">
              Check out our FAQ for answers to common questions about pricing, features, and more.
            </p>
            <Link href="/faq">
              <Button variant="secondary" size="lg" className="group">
                View FAQ
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function ComparisonRow({
  feature,
  free,
  pro,
  isCheck = false,
}: {
  feature: string;
  free: string;
  pro: string;
  isCheck?: boolean;
}) {
  return (
    <tr className="border-b border-border last:border-b-0">
      <td className="py-4 px-6 text-text-primary">{feature}</td>
      <td className="py-4 px-6 text-center text-text-secondary">{free}</td>
      <td className={`py-4 px-6 text-center bg-accent-pink-light/30 ${isCheck ? "text-accent-pink font-bold text-lg" : "text-text-primary font-medium"}`}>
        {pro}
      </td>
    </tr>
  );
}
