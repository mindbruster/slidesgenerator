import Link from "next/link";
import { Button } from "@/components/atoms";
import { FeatureCard } from "@/components/molecules";
import { Sparkles, Edit3, Download, ArrowRight, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="min-h-[calc(100vh-64px)] overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-16 pb-24 md:pt-24 md:pb-32">
        {/* Decorative blobs */}
        <div className="absolute top-10 left-[5%] w-64 h-64 bg-accent-pink rounded-full opacity-30 blur-3xl animate-pulse" />
        <div className="absolute top-40 right-[10%] w-48 h-48 bg-accent-pink-light rounded-full opacity-40 blur-2xl" />
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-accent-pink rounded-full opacity-20 blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-4">
          {/* Badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-bg-white border-2 border-border-dark rounded-full shadow-[2px_2px_0px_0px_#0f0f0f]">
              <Zap className="w-4 h-4 text-accent-pink" />
              <span className="text-sm font-semibold text-text-primary">AI-powered presentations</span>
            </div>
          </div>

          {/* Headline */}
          <div className="text-center max-w-4xl mx-auto mb-12">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-text-primary mb-6 leading-[1.1] tracking-tight">
              Stop designing.
              <br />
              <span className="relative inline-block">
                Start presenting
                <svg
                  className="absolute -bottom-1 md:-bottom-2 left-0 w-full"
                  viewBox="0 0 400 16"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M2 12C80 4 200 4 398 12"
                    stroke="#ff90e8"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
              Paste your notes, articles, or ideas. Get a polished slide deck in seconds.
              No templates. No fiddling. Just results.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <Link href="/app">
              <Button size="lg" className="text-lg px-8 py-4 group">
                Get started free
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <span className="text-text-muted text-sm">No account required</span>
          </div>

          {/* Hero Visual - Stylized Slide Preview */}
          <div className="relative max-w-4xl mx-auto">
            {/* Main preview card */}
            <div className="relative bg-bg-white border-2 border-border-dark rounded-2xl shadow-[8px_8px_0px_0px_#0f0f0f] overflow-hidden">
              {/* Browser-like header */}
              <div className="flex items-center gap-2 px-4 py-3 border-b-2 border-border-dark bg-bg-cream">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="max-w-xs mx-auto h-6 bg-bg-white rounded-lg border border-border" />
                </div>
              </div>

              {/* Slide content mockup - Realistic slide preview */}
              <div className="aspect-video bg-gradient-to-br from-bg-cream to-bg-white p-6 md:p-10">
                <div className="h-full flex flex-col">
                  {/* Slide title */}
                  <h3 className="text-xl md:text-3xl lg:text-4xl font-bold text-text-primary mb-4 md:mb-6">
                    Grow Your Business with AI
                  </h3>

                  {/* Slide content */}
                  <div className="flex-1 flex gap-6 md:gap-10">
                    {/* Left side - bullet points */}
                    <div className="flex-1 space-y-3 md:space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 mt-2 rounded-full bg-accent-pink flex-shrink-0" />
                        <p className="text-sm md:text-base text-text-secondary">Automate repetitive tasks and save 10+ hours weekly</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 mt-2 rounded-full bg-accent-pink flex-shrink-0" />
                        <p className="text-sm md:text-base text-text-secondary">Increase customer engagement by 3x with personalization</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 mt-2 rounded-full bg-accent-pink flex-shrink-0" />
                        <p className="text-sm md:text-base text-text-secondary">Scale operations without adding headcount</p>
                      </div>
                    </div>

                    {/* Right side - visual element */}
                    <div className="hidden md:flex w-1/3 items-center justify-center">
                      <div className="relative w-full aspect-square max-w-[160px]">
                        <div className="absolute inset-0 bg-accent-pink/20 rounded-2xl rotate-6" />
                        <div className="absolute inset-0 bg-accent-pink rounded-2xl flex items-center justify-center">
                          <div className="text-center">
                            <p className="text-3xl lg:text-4xl font-black text-text-primary">87%</p>
                            <p className="text-xs text-text-primary/70 font-medium">Growth Rate</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Slide footer */}
                  <div className="flex items-center justify-between pt-4 mt-auto border-t border-border-light">
                    <span className="text-xs text-text-muted">AI Strategy 2025</span>
                    <span className="text-xs font-medium text-accent-pink">Slide 3 of 8</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 md:-top-6 md:-right-6 w-16 h-16 md:w-20 md:h-20 bg-accent-pink border-2 border-border-dark rounded-2xl shadow-[4px_4px_0px_0px_#0f0f0f] flex items-center justify-center rotate-12">
              <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-text-primary" />
            </div>

            <div className="absolute -bottom-3 -left-3 md:-bottom-4 md:-left-4 px-4 py-2 bg-bg-dark border-2 border-border-dark rounded-xl shadow-[3px_3px_0px_0px_#ff90e8] -rotate-6">
              <span className="text-sm md:text-base font-bold text-text-inverse">5 slides ready!</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4">
          {/* Section header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Why Decksnap?
            </h2>
            <p className="text-lg text-text-secondary max-w-xl mx-auto">
              We stripped away everything you hate about making presentations.
            </p>
          </div>

          {/* Features grid */}
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            <FeatureCard
              icon={<Sparkles className="w-6 h-6" />}
              title="One-click magic"
              description="No configuration needed. Paste your content, click generate, done. It just works."
            />
            <FeatureCard
              icon={<Edit3 className="w-6 h-6" />}
              title="Edit directly"
              description="Click any text on your slides to edit inline. No regeneration loops or dialogs."
            />
            <FeatureCard
              icon={<Download className="w-6 h-6" />}
              title="Export anywhere"
              description="Download as PDF or share with a link. Ready to present in any meeting."
            />
          </div>
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="relative py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-accent-pink rounded-3xl rotate-2" />
            <div className="relative bg-bg-white border-2 border-border-dark rounded-3xl p-8 md:p-12 shadow-[6px_6px_0px_0px_#0f0f0f]">
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                Ready to ditch the design work?
              </h2>
              <p className="text-lg text-text-secondary mb-8 max-w-lg mx-auto">
                Join thousands who have already switched to the faster way to create presentations.
              </p>
              <Link href="/app">
                <Button size="lg" className="text-lg px-8 py-4 group">
                  Create your first deck
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-2 border-border py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-text-muted text-sm">
              Built with care. Made for people who value their time.
            </p>
            <p className="text-text-muted text-sm">
              &copy; {new Date().getFullYear()} Decksnap
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
