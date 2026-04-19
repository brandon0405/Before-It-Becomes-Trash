import type { Metadata } from "next";
import { Source_Sans_3 } from "next/font/google";
import type { ReactNode } from "react";

import { Providers } from "@/components/providers";

import "./globals.css";

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  display: "swap",
  fallback: ["Segoe UI", "Tahoma", "Geneva", "Verdana", "sans-serif"],
});

export const metadata: Metadata = {
  title: "Before It Becomes Trash",
  description:
    "AI-powered Earth Day rescue platform with Auth0, Supabase, Solana Devnet and Gemini.",
  icons: {
    icon: "/images/tierra-logo.ico",
    shortcut: "/images/tierra-logo.ico",
  },
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${sourceSans.className} min-h-screen bg-planet-day text-slate-900 antialiased transition-colors duration-300 dark:bg-planet-night dark:text-slate-100`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
