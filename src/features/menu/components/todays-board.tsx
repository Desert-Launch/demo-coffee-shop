"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { SectionHead } from "@/components/layout/section-head";
import { DrinkSwatch } from "@/components/shared/drink-swatch";
import { formatAed } from "@/lib/utils";
import { useMenu } from "../hooks/use-menu";

/** The chalkboard by the till: what is open today, and what came out of the oven. */
const BOARD = [
  {
    code: "FIL-01",
    rail: "Filter today",
    line: "Wadi lot 07, washed. Grapefruit, brown sugar, long finish.",
  },
  {
    code: "BAK-03",
    rail: "Out of the oven",
    line: "Baked at five. When they are gone they are gone.",
  },
  {
    code: "TEA-01",
    rail: "All day, every day",
    line: "On the boil from open to close. Nine dirhams, always.",
  },
] as const;

export function TodaysBoard() {
  const { data, isPending } = useMenu();
  const byCode = new Map((data ?? []).map((item) => [item.code, item]));

  return (
    <section aria-labelledby="today-heading">
      <SectionHead
        id="today-heading"
        rail="Today · Al Quoz 3"
        title="On the board"
        description="It changes when the roast changes, so it is rarely the same two weeks running."
      />

      <ul className="mt-8 grid gap-px overflow-hidden rounded-lg border border-roast-700 bg-roast-700 md:grid-cols-3">
        {BOARD.map((entry) => {
          const item = byCode.get(entry.code);

          return (
            <li key={entry.code} className="bg-roast-800 p-6">
              <p className="db-rail">{entry.rail}</p>

              {isPending || !item ? (
                <div className="mt-4 space-y-3">
                  <Skeleton className="h-6 w-2/3" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-4/5" />
                </div>
              ) : (
                <div className="mt-4 flex items-start gap-4">
                  <DrinkSwatch category={item.category} className="h-16 w-11" />
                  <div className="min-w-0">
                    <p className="font-display text-xl text-chaff-50">
                      {item.name}
                    </p>
                    <p className="tnum mt-1 text-sm text-ember-400">
                      AED {formatAed(item.basePriceFils)}
                    </p>
                    <p className="mt-3 text-sm leading-snug text-chaff-400">
                      {entry.line}
                    </p>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
