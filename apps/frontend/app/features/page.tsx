import Link from "next/link";
import { Button } from "@/components/atoms";
import {
  Sparkles,
  Edit3,
  Download,
  Zap,
  Palette,
  FileText,
  Share2,
  Clock,
  ArrowRight,
} from "lucide-react";

const FEATURES = [
  {
    icon: Sparkles,
    title: "AI-Powered Generation",
    description:
      "Paste any text—notes, articles, outlines—and watch as our AI transforms it into a cohesive slide deck with proper structure and flow.",
    color: "bg-accent-pink",
  },
  {
    icon: Edit3,
    title: "Inline Editing",
    description:
      "Click any text on your slides to edit directly. No dialogs, no regeneration. Just click, type, done. Changes save automatically.",
    color: "bg-yellow-300",
  },
  {
    icon: Palette,
    title: "Smart Layouts",
    description:
      "Our AI chooses the right layout for your content—title slides, bullet points, quotes, section breaks—all automatically optimized.",
    color: "bg-green-300",
  },
  {
    icon: Download,
    title: "Export Anywhere",
    description:
      "Download your presentation as a clean PDF ready for any meeting. Share a link for live viewing. Present directly from Decksnap.",
    color: "bg-blue-300",
  },
  {
    icon: Clock,
    title: "Instant Results",
    description:
      "No more hours spent tweaking slides. Get a polished deck in under 30 seconds. Spend your time on what matters—your content.",
    color: "bg-orange-300",
  },
  {
    icon: Share2,
    title: "Easy Sharing",
    description:
      "Generate a shareable link for your presentation. Recipients can view your slides without needing an account or downloading anything.",
    color: "bg-purple-300",
  },
];

export default function FeaturesPage() {
  return (
    <main className="min-h-[calc(100vh-64px)]">
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-10 left-[5%] w-56 h-56 bg-accent-pink rounded-full opacity-30 blur-3xl" />
        <div className="absolute bottom-20 right-[10%] w-48 h-48 bg-accent-pink-light rounded-full opacity-40 blur-3xl" />

        <div className="relative max-w-5xl mx-auto px-4">
          {/* Badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-bg-white border-2 border-border-dark rounded-full shadow-[2px_2px_0px_0px_#0f0f0f]">
              <Zap className="w-4 h-4 text-accent-pink" />
              <span className="text-sm font-semibold text-text-primary">Features</span>
            </div>
          </div>

          {/* Headline */}
          <div className="text-center max-w-3xl mx-auto mb-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-text-primary mb-6 leading-tight">
              Everything you need.{" "}
              <span className="relative inline-block">
                Nothing you don&apos;t
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
              We built Decksnap with one goal: make creating presentations so fast it feels like magic.
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {FEATURES.map((feature, index) => (
              <FeatureBlock
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                color={feature.color}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary text-center mb-16">
            How it works
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <StepCard
              number="1"
              title="Paste your content"
              description="Copy any text—meeting notes, article, outline—and paste it into Decksnap."
            />
            <StepCard
              number="2"
              title="Click generate"
              description="Our AI analyzes your content and creates a structured presentation in seconds."
            />
            <StepCard
              number="3"
              title="Edit & export"
              description="Fine-tune any slide with inline editing, then export as PDF or share a link."
            />
          </div>
        </div>
      </section>

      {/* Demo Preview */}
      <section className="py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-4">
          <div className="relative">
            {/* Main preview */}
            <div className="bg-bg-white border-2 border-border-dark rounded-2xl shadow-[8px_8px_0px_0px_#0f0f0f] overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b-2 border-border-dark bg-bg-cream">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="max-w-xs mx-auto h-6 bg-bg-white rounded-lg border border-border flex items-center justify-center">
                    <span className="text-xs text-text-muted">decksnap.app/presentation</span>
                  </div>
                </div>
              </div>
              <div className="aspect-video bg-gradient-to-br from-bg-cream to-bg-white p-8 md:p-12 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-accent-pink-light rounded-2xl flex items-center justify-center mx-auto mb-6 border-2 border-border-dark shadow-[3px_3px_0px_0px_#0f0f0f]">
                    <FileText className="w-10 h-10 text-text-primary" />
                  </div>
                  <p className="text-xl font-semibold text-text-primary mb-2">
                    Your slides appear here
                  </p>
                  <p className="text-text-secondary">
                    Clean, professional, ready to present
                  </p>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -top-4 -right-4 md:-top-6 md:-right-6 px-4 py-2 bg-accent-pink border-2 border-border-dark rounded-xl shadow-[3px_3px_0px_0px_#0f0f0f] rotate-6">
              <span className="text-sm md:text-base font-bold text-text-primary">30 seconds!</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-accent-pink rounded-3xl rotate-1" />
            <div className="relative bg-bg-white border-2 border-border-dark rounded-3xl p-8 md:p-12 shadow-[6px_6px_0px_0px_#0f0f0f]">
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                Ready to try it?
              </h2>
              <p className="text-lg text-text-secondary mb-8 max-w-lg mx-auto">
                Create your first presentation in under a minute. No account required.
              </p>
              <Link href="/app">
                <Button size="lg" className="text-lg px-8 py-4 group">
                  Start creating
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function FeatureBlock({
  icon: Icon,
  title,
  description,
  color,
  delay,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  color: string;
  delay: number;
}) {
  return (
    <div
      className="bg-bg-white border-2 border-border-dark rounded-2xl p-6 shadow-[3px_3px_0px_0px_#0f0f0f] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_#0f0f0f] transition-all"
      style={{ animationDelay: `${delay}s` }}
    >
      <div
        className={`w-14 h-14 ${color} rounded-xl flex items-center justify-center mb-5 border-2 border-border-dark shadow-[2px_2px_0px_0px_#0f0f0f]`}
      >
        <Icon className="w-7 h-7 text-text-primary" />
      </div>
      <h3 className="text-xl font-bold text-text-primary mb-3">{title}</h3>
      <p className="text-text-secondary leading-relaxed">{description}</p>
    </div>
  );
}

function StepCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="w-16 h-16 bg-bg-dark rounded-2xl flex items-center justify-center mx-auto mb-5 border-2 border-border-dark shadow-[3px_3px_0px_0px_#ff90e8]">
        <span className="text-2xl font-black text-text-inverse">{number}</span>
      </div>
      <h3 className="text-xl font-bold text-text-primary mb-3">{title}</h3>
      <p className="text-text-secondary">{description}</p>
    </div>
  );
}
