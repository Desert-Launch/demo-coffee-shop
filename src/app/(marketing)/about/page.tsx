import type { Metadata } from "next";

import { PageContainer } from "@/components/layout/page-container";
import { SectionHead } from "@/components/layout/section-head";
import { StoryStrip } from "@/components/marketing/story-strip";
import { RoastCurve } from "@/components/shared/roast-curve";

export const metadata: Metadata = {
  title: "About",
  description:
    "A roastery in Dubai with a bar at the front. How we buy, roast and grind at the Demo Café.",
};

/** Real specialty-coffee metadata: this is what a bag label actually carries. */
const LOTS = [
  {
    lot: "Wadi lot 07",
    origin: "Yirgacheffe, Ethiopia",
    process: "Washed",
    altitude: "1,950 m",
    notes: "Grapefruit, brown sugar, jasmine",
  },
  {
    lot: "Sidama 12",
    origin: "Sidama, Ethiopia",
    process: "Natural",
    altitude: "2,100 m",
    notes: "Blueberry, cocoa, cane sugar",
  },
  {
    lot: "Huila 04",
    origin: "Huila, Colombia",
    process: "Washed",
    altitude: "1,750 m",
    notes: "Red apple, caramel, almond",
  },
  {
    lot: "Kirinyaga 02",
    origin: "Kirinyaga, Kenya",
    process: "Washed",
    altitude: "1,800 m",
    notes: "Blackcurrant, tomato leaf, syrup",
  },
];

export default function AboutPage() {
  return (
    <PageContainer className="py-14">
      <div className="grid gap-12 border-b border-roast-700 pb-16 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
        <div>
          <p className="db-rail">Our story · started with one drum</p>
          <h1 className="mt-5 max-w-2xl text-4xl leading-tight tracking-tighter text-chaff-50 md:text-5xl">
            We took a warehouse because the roaster would not fit anywhere else.
          </h1>
          <div className="mt-7 max-w-xl space-y-4 text-chaff-300">
            <p>
              The Demo Café started in 2019 as a 12-kilo drum in a shared unit
              on Demo Street, selling bags to three restaurants and anyone who
              knocked. The bar came later, and only because people kept turning
              up wanting a cup of what they could smell from the road.
            </p>
            <p>
              We still buy in whole lots rather than blends, still roast in the
              same warehouse, and still grind every dose at the bar. Nothing is
              held over: a batch that is more than nine days off the drop comes
              off the hopper and goes home with staff.
            </p>
            <p>
              Six origins stay open at any time. The bar will happily pour you a
              taste of two of them side by side before you decide.
            </p>
          </div>
        </div>

        <div className="self-start rounded-lg border border-roast-700 bg-roast-800 p-7">
          <p className="db-rail">The numbers, honestly</p>
          <dl className="mt-5 space-y-4">
            {[
              { label: "Opened", value: "2019" },
              { label: "Batch size", value: "12 kg" },
              { label: "Origins open", value: "6" },
              { label: "Days from drop to bin", value: "9 max" },
              { label: "Cups on a Friday", value: "≈ 640" },
            ].map((entry) => (
              <div
                key={entry.label}
                className="flex items-baseline justify-between gap-4 border-b border-roast-700 pb-3 last:border-b-0 last:pb-0"
              >
                <dt className="text-sm text-chaff-400">{entry.label}</dt>
                <dd className="tnum text-lg text-chaff-50">{entry.value}</dd>
              </div>
            ))}
          </dl>
          <RoastCurve className="mt-7 h-16 w-full text-ember-600" showFirstCrack />
        </div>
      </div>

      <section className="pt-16" aria-labelledby="lots-heading">
        <SectionHead
          id="lots-heading"
          rail="Open now · four of six shown"
          title="What is on the shelf"
          description="Every lot is bought whole and priced before harvest. The label carries the same four things every time."
        />

        <div className="mt-8 overflow-x-auto rounded-lg border border-roast-700">
          <table className="w-full min-w-[46rem] border-collapse text-left text-sm">
            <caption className="sr-only">
              Coffee lots currently open at the Demo Café
            </caption>
            <thead>
              <tr className="bg-roast-850">
                {["Lot", "Origin", "Process", "Altitude", "Tastes like"].map(
                  (heading) => (
                    <th
                      key={heading}
                      scope="col"
                      className="db-rail px-5 py-3 font-normal"
                    >
                      {heading}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {LOTS.map((lot) => (
                <tr
                  key={lot.lot}
                  className="border-t border-roast-700 bg-roast-800"
                >
                  <th
                    scope="row"
                    className="px-5 py-4 text-left font-display text-base font-semibold text-chaff-50"
                  >
                    {lot.lot}
                  </th>
                  <td className="px-5 py-4 text-chaff-300">{lot.origin}</td>
                  <td className="px-5 py-4 text-chaff-300">{lot.process}</td>
                  <td className="tnum px-5 py-4 text-chaff-400">
                    {lot.altitude}
                  </td>
                  <td className="px-5 py-4 text-chaff-400">{lot.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="pt-20">
        <StoryStrip />
      </div>
    </PageContainer>
  );
}
