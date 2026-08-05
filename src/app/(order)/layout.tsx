import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { Wordmark } from "@/components/layout/wordmark";

/**
 * Checkout drops the full navigation on purpose — one job per screen. The only
 * way out is back to the menu.
 */
export default function OrderLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b border-roast-700 bg-roast-950">
        <PageContainer className="flex h-16 items-center justify-between gap-6">
          <Wordmark />
          <Link
            href="/menu"
            className="inline-flex items-center gap-1.5 text-sm text-chaff-300 transition-colors hover:text-ember-400"
          >
            <ArrowLeft className="size-4" />
            Back to the menu
          </Link>
        </PageContainer>
      </header>

      <main id="main" className="flex-1">
        {children}
      </main>

      <footer className="border-t border-roast-700 py-6">
        <PageContainer>
          <p className="db-rail">
            Demo build · no card is charged and no order reaches a real café
          </p>
        </PageContainer>
      </footer>
    </div>
  );
}
