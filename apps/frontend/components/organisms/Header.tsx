"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Layers } from "lucide-react";
import { Button } from "@/components/atoms";
import { cn } from "@/lib/utils/cn";

const NAV_LINKS = [
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/faq", label: "FAQ" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-bg-cream/80 backdrop-blur-sm border-b-2 border-border">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 bg-bg-dark rounded-xl flex items-center justify-center shadow-[2px_2px_0px_0px_#ff90e8] group-hover:shadow-[3px_3px_0px_0px_#ff90e8] transition-shadow">
            <Layers className="w-5 h-5 text-text-inverse" />
          </div>
          <span className="text-xl font-bold text-text-primary">Decksnap</span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-1 md:gap-2">
          {/* Nav Links - hidden on very small screens */}
          <div className="hidden sm:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                  pathname === link.href
                    ? "text-text-primary bg-accent-pink-light"
                    : "text-text-secondary hover:text-text-primary hover:bg-bg-white"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Divider */}
          <div className="hidden sm:block w-px h-6 bg-border mx-2" />

          {/* Sign in */}
          <Link href="/app">
            <Button variant="secondary" size="sm">
              Sign in
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
