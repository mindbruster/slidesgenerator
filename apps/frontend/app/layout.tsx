import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Header } from "@/components/organisms";
import { getGoogleFontsUrl } from "@/lib/themes";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

// Get the Google Fonts URL for all theme fonts
const googleFontsUrl = getGoogleFontsUrl();

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
      <head>
        {/* Preconnect to Google Fonts for faster loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Load all theme fonts */}
        {googleFontsUrl && <link href={googleFontsUrl} rel="stylesheet" />}
      </head>
      <body className="min-h-screen bg-bg-cream antialiased">
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
