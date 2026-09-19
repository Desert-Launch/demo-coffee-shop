"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/layout/page-container";
import { ROAST_CURVE_PATH } from "@/components/shared/roast-curve";

/** The last batch off the drum. Static demo data, printed like an instrument log. */
const ROAST_LOG = [
  { label: "Charge", value: "196 °C" },
  { label: "Turning point", value: "1:28" },
  { label: "First crack", value: "8:42" },
  { label: "Drop", value: "204 °C" },
  { label: "Development", value: "21.4 %" },
  { label: "Batch", value: "12 kg" },
];

export function Hero() {
  const reduceMotion = useReducedMotion();

  const rise = (delay: number) =>
    reduceMotion
      ? { initial: { opacity: 1 }, animate: { opacity: 1 } }
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.55, delay, ease: [0.2, 0.8, 0.2, 1] as const },
        };

  return (
    <section className="relative overflow-hidden border-b border-roast-700">
      <div
        aria-hidden
        className="db-gridlines pointer-events-none absolute inset-0 opacity-40"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -right-24 size-[32rem] rounded-full bg-ember-500/8 blur-3xl"
      />

      <PageContainer className="relative grid gap-12 py-16 md:py-24 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
        <div className="max-w-2xl">
          <motion.p {...rise(0)} className="db-rail">
            Roastery and bar · Demo District · since 2019
          </motion.p>

          <motion.h1
            {...rise(0.08)}
            className="mt-6 text-5xl leading-flat tracking-tighter text-chaff-50 md:text-6xl"
          >
            We roast at five
            <br />
            and pour till one.
          </motion.h1>

          <motion.p
            {...rise(0.16)}
            className="mt-7 max-w-xl text-lg leading-snug text-chaff-300"
          >
            A roastery with a bar at the front, not a café that buys in beans.
            Six origins stay open at any time and everything is ground when you
            order it, never before.
          </motion.p>

          <motion.div {...rise(0.24)} className="mt-9 flex flex-wrap gap-3">
            <Button asChild size="lg" className="h-11 px-5 text-base">
              <Link href="/menu">
                Start your order
                <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-11 px-5 text-base"
            >
              <Link href="/about">How we roast</Link>
            </Button>
          </motion.div>
        </div>

        {/* The thesis, stated as an instrument trace: this is a roastery. */}
        <motion.figure
          {...rise(0.3)}
          className="self-center rounded-lg border border-roast-700 bg-roast-800/80 p-6 backdrop-blur-sm"
        >
          <figcaption className="flex items-center justify-between gap-3">
            <span className="db-rail">Last roast · Wadi lot 07</span>
            <span className="db-rail text-ember-400">Washed</span>
          </figcaption>

          <svg
            viewBox="0 0 240 80"
            fill="none"
            aria-hidden
            className="mt-5 h-24 w-full text-ember-500"
          >
            <g stroke="currentColor" strokeOpacity="0.22" strokeWidth="1">
              <line x1="0" y1="70" x2="240" y2="70" />
              <line x1="0" y1="46" x2="240" y2="46" strokeDasharray="2 6" />
              <line x1="0" y1="22" x2="240" y2="22" strokeDasharray="2 6" />
            </g>
            <motion.path
              d={ROAST_CURVE_PATH}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              initial={reduceMotion ? { pathLength: 1 } : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { duration: 1.4, delay: 0.45, ease: "easeInOut" }
              }
            />
            <line
              x1="178"
              y1="6"
              x2="178"
              y2="70"
              stroke="currentColor"
              strokeOpacity="0.5"
              strokeDasharray="3 4"
            />
          </svg>

          <p className="db-rail mt-2 text-right">First crack at 8:42</p>

          <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-roast-700 pt-5">
            {ROAST_LOG.map((entry) => (
              <div key={entry.label} className="flex justify-between gap-3">
                <dt className="text-xs text-chaff-400">{entry.label}</dt>
                <dd className="tnum text-xs text-chaff-100">{entry.value}</dd>
              </div>
            ))}
          </dl>
        </motion.figure>
      </PageContainer>
    </section>
  );
}
