import Link from "next/link";

import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/layout/page-container";
import { Wordmark } from "@/components/layout/wordmark";
import { RoastCurve } from "@/components/shared/roast-curve";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b border-roast-700">
        <PageContainer className="flex h-16 items-center">
          <Wordmark />
        </PageContainer>
      </header>

      <main id="main" className="flex flex-1 items-center">
        <PageContainer className="py-20">
          <p className="db-rail">404 · nothing at this address</p>
          <h1 className="mt-5 max-w-xl text-4xl leading-tight tracking-tighter text-chaff-50">
            This page is not on the menu.
          </h1>
          <p className="mt-4 max-w-md text-chaff-300">
            The link may be old, or the page may have moved. The menu and the
            order board are both a click away.
          </p>
          <RoastCurve className="mt-10 h-20 w-64 text-roast-600" />
          <div className="mt-10 flex flex-wrap gap-3">
            <Button asChild size="lg" className="h-11 px-5">
              <Link href="/menu">See the menu</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-11 px-5">
              <Link href="/">Back to the front</Link>
            </Button>
          </div>
        </PageContainer>
      </main>
    </div>
  );
}
