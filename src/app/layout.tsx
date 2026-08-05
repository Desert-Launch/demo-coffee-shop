import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Geist_Mono, Inter_Tight } from "next/font/google";

import { Providers } from "./providers";
import "./globals.css";

/* Display: Bricolage Grotesque — wide, slightly irregular, carries the
   personality. Body: Inter Tight — narrow enough to sit under it without
   fighting. Data: Geist Mono — every price, code and timestamp. */
const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-db-display",
  display: "swap",
});

const body = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-db-body",
  display: "swap",
});

const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-db-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Dune & Bean — a roastery café in Al Quoz",
    template: "%s · Dune & Bean",
  },
  description:
    "Six origins on bar, ground to order. Order coffee and bakery for pickup in Al Quoz or delivery across Dubai.",
};

export const viewport: Viewport = {
  // The one literal colour in the app. It is serialised into a meta tag before
  // any stylesheet loads, so it cannot reference --db-roast-950; keep the two
  // in step by hand.
  themeColor: "#100c09",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${display.variable} ${body.variable} ${mono.variable} min-h-dvh bg-background text-foreground`}
      >
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-ember-500 focus:px-4 focus:py-2 focus:text-sm focus:text-roast-950"
        >
          Skip to content
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
