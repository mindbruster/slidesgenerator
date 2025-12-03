import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Decksnap - One-Click Slide Generation",
  description:
    "Turn any idea or text into a polished, presentation-ready slide deck in one click.",
  keywords: ["presentation", "slides", "AI", "generator", "deck"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-bg-cream antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
