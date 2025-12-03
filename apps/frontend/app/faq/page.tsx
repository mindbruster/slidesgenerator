import Link from "next/link";
import { FAQItem } from "@/components/molecules";
import { Button } from "@/components/atoms";
import { HelpCircle, ArrowRight } from "lucide-react";

const GENERAL_FAQS = [
  {
    question: "What is Decksnap?",
    answer:
      "Decksnap is an AI-powered presentation generator. Paste any text—meeting notes, articles, outlines—and get a polished slide deck in seconds. No design skills required.",
  },
  {
    question: "How does the AI work?",
    answer:
      "Our AI analyzes your text to understand its structure and key points. It then creates slides with appropriate layouts, breaks content into digestible sections, and ensures visual consistency throughout your presentation.",
  },
  {
    question: "What kind of content can I paste?",
    answer:
      "Almost anything! Meeting notes, blog posts, research summaries, project outlines, lecture notes, product descriptions—any text with enough substance to create a presentation from. We recommend at least 50 characters for best results.",
  },
  {
    question: "Do I need an account to use Decksnap?",
    answer:
      "No! You can start creating presentations immediately without signing up. Creating an account lets you save your presentations and access them later.",
  },
];

const PRICING_FAQS = [
  {
    question: "Is there really a free plan?",
    answer:
      "Yes! The free plan lets you create up to 3 presentations per month with up to 10 slides each. You can export to PDF (with a small watermark) and share links to your presentations.",
  },
  {
    question: "Can I cancel my Pro subscription anytime?",
    answer:
      "Absolutely. There are no contracts or commitments. Cancel anytime from your account settings, and you'll retain Pro access until the end of your billing period.",
  },
  {
    question: "Do you offer refunds?",
    answer:
      "Yes, we offer a 7-day money-back guarantee. If Pro isn't right for you, contact us within 7 days of your first payment for a full refund.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards (Visa, Mastercard, American Express) through our secure payment processor. We also support Apple Pay and Google Pay.",
  },
];

const FEATURES_FAQS = [
  {
    question: "How many slides can I generate?",
    answer:
      "Free users can generate up to 10 slides per presentation. Pro users can generate up to 30 slides per deck, which is plenty for most use cases.",
  },
  {
    question: "Can I edit slides after generation?",
    answer:
      "Yes! Click on any text in your slides to edit it directly. Changes save automatically. You can modify titles, bullet points, and any other text content.",
  },
  {
    question: "What export formats are supported?",
    answer:
      "Currently, we support PDF export which works everywhere—email, print, presentations. We're working on PowerPoint and Google Slides export for a future update.",
  },
  {
    question: "Can I customize the slide design?",
    answer:
      "Right now, our AI chooses the best layouts based on your content. Custom themes and color options are coming soon!",
  },
];

export default function FAQPage() {
  return (
    <main className="min-h-[calc(100vh-64px)]">
      {/* Hero Section */}
      <section className="relative pt-16 pb-16 md:pt-24 md:pb-20 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 left-[10%] w-48 h-48 bg-accent-pink rounded-full opacity-30 blur-3xl" />
        <div className="absolute bottom-0 right-[15%] w-56 h-56 bg-accent-pink-light rounded-full opacity-40 blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-4">
          {/* Badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-bg-white border-2 border-border-dark rounded-full shadow-[2px_2px_0px_0px_#0f0f0f]">
              <HelpCircle className="w-4 h-4 text-accent-pink" />
              <span className="text-sm font-semibold text-text-primary">FAQ</span>
            </div>
          </div>

          {/* Headline */}
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-black text-text-primary mb-6 leading-tight">
              Frequently asked{" "}
              <span className="relative inline-block">
                questions
                <svg
                  className="absolute -bottom-1 md:-bottom-2 left-0 w-full"
                  viewBox="0 0 300 12"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M2 8C60 4 150 4 298 10"
                    stroke="#ff90e8"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>
            <p className="text-xl text-text-secondary">
              Everything you need to know about Decksnap. Can&apos;t find what you&apos;re looking for?{" "}
              <span className="text-text-primary font-medium">Reach out to us.</span>
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4 space-y-16">
          {/* General */}
          <FAQSection title="General" faqs={GENERAL_FAQS} />

          {/* Pricing */}
          <FAQSection title="Pricing & Billing" faqs={PRICING_FAQS} />

          {/* Features */}
          <FAQSection title="Features & Limits" faqs={FEATURES_FAQS} />
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-bg-white border-2 border-border-dark rounded-2xl p-8 md:p-12 shadow-[4px_4px_0px_0px_#0f0f0f] text-center">
            <div className="w-16 h-16 bg-accent-pink-light rounded-2xl flex items-center justify-center mx-auto mb-6 border-2 border-border-dark">
              <HelpCircle className="w-8 h-8 text-text-primary" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-4">
              Still have questions?
            </h2>
            <p className="text-lg text-text-secondary mb-8 max-w-md mx-auto">
              Can&apos;t find the answer you&apos;re looking for? Our team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="mailto:hello@decksnap.app">
                <Button size="lg" className="group">
                  Contact support
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="secondary" size="lg">
                  View pricing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function FAQSection({
  title,
  faqs,
}: {
  title: string;
  faqs: { question: string; answer: string }[];
}) {
  return (
    <div>
      <h2 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-3">
        <div className="w-2 h-8 bg-accent-pink rounded-full" />
        {title}
      </h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <FAQItem key={index} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </div>
  );
}
