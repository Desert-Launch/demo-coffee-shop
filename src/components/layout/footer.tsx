import Link from "next/link";

import { PageContainer } from "@/components/layout/page-container";
import { Wordmark } from "@/components/layout/wordmark";
import { RoastCurve } from "@/components/shared/roast-curve";

const HOURS = [
  { days: "Sunday to Thursday", time: "06:00 — 01:00" },
  { days: "Friday", time: "07:00 — 02:00" },
  { days: "Saturday", time: "07:00 — 01:00" },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-roast-700 bg-roast-900">
      <PageContainer className="grid gap-12 py-16 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <Wordmark />
          <p className="mt-4 max-w-xs text-sm text-chaff-400">
            A roastery with a café attached, not the other way round. Warehouse
            14, street 8, Al Quoz 3, Dubai.
          </p>
          <RoastCurve className="mt-8 h-16 w-48 text-roast-600" />
        </div>

        <div>
          <p className="db-rail">Hours</p>
          <dl className="mt-4 space-y-2 text-sm">
            {HOURS.map((entry) => (
              <div key={entry.days} className="flex justify-between gap-4">
                <dt className="text-chaff-300">{entry.days}</dt>
                <dd className="tnum text-chaff-400">{entry.time}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div>
          <p className="db-rail">Elsewhere</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link href="/menu" className="text-chaff-300 hover:text-ember-400">
                Menu
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-chaff-300 hover:text-ember-400">
                Our beans
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="text-chaff-300 hover:text-ember-400"
              >
                Find us
              </Link>
            </li>
            <li>
              <Link href="/admin" className="text-chaff-400 hover:text-ember-400">
                Staff view
              </Link>
            </li>
          </ul>
        </div>
      </PageContainer>

      <div className="border-t border-roast-700">
        <PageContainer className="flex flex-col gap-2 py-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="db-rail">
            Demo build · fictional café · no real orders are placed
          </p>
          <p className="db-rail">Prices in AED, VAT included at 5%</p>
        </PageContainer>
      </div>
    </footer>
  );
}
