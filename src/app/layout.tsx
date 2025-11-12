import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Analytics } from "@vercel/analytics/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "IslandGo AI - Growth Strategy Demo",
    template: "%s | IslandGo AI",
  },
  description: "AI-powered growth engine for food discovery platforms. Automated creator recruitment, content gap analysis, and viral marketing automation.",
  keywords: ["AI", "food discovery", "growth strategy", "creator recruitment", "content marketing", "analytics"],
  authors: [{ name: "IslandGo" }],
  creator: "IslandGo",
  publisher: "IslandGo",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://islandgo-ai-demo.vercel.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "IslandGo AI",
    title: "IslandGo AI - Growth Strategy Demo",
    description: "AI-powered growth engine for food discovery platforms",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "IslandGo AI Growth Strategy Demo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "IslandGo AI - Growth Strategy Demo",
    description: "AI-powered growth engine for food discovery platforms",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ErrorBoundary>
          <Navigation />
          {children}
          <Analytics />
        </ErrorBoundary>
      </body>
    </html>
  );
}
