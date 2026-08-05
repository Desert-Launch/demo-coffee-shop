import { SectionHead } from "@/components/layout/section-head";
import { RoastCurve } from "@/components/shared/roast-curve";

/** Numbered because sourcing to cup really is a sequence, not decoration. */
const STAGES = [
  {
    step: "01",
    title: "We buy whole lots",
    body: "One farm, one process, one price agreed before harvest. Six lots open at a time, listed by altitude and picking date on the bag.",
  },
  {
    step: "02",
    title: "We roast in twelve-kilo batches",
    body: "Small enough that a batch is drunk within nine days of the drop. The profile for each lot is logged and the log is on the wall.",
  },
  {
    step: "03",
    title: "We grind at the bar",
    body: "Nothing is pre-ground and nothing is pre-dosed. It costs us thirty seconds a cup and it is the difference you taste.",
  },
];

export function StoryStrip() {
  return (
    <section aria-labelledby="story-heading">
      <SectionHead
        id="story-heading"
        rail="Green to cup · three steps"
        title="Everything happens in one warehouse"
        description="There is no central kitchen and no third-party roaster. The drum is twenty metres from where you order."
      />

      <ol className="mt-10 grid gap-px overflow-hidden rounded-lg border border-roast-700 bg-roast-700 md:grid-cols-3">
        {STAGES.map((stage) => (
          <li key={stage.step} className="bg-roast-800 p-7">
            <p className="tnum text-2xl text-ember-500">{stage.step}</p>
            <h3 className="mt-4 font-display text-xl text-chaff-50">
              {stage.title}
            </h3>
            <p className="mt-3 text-sm leading-snug text-chaff-400">
              {stage.body}
            </p>
          </li>
        ))}
      </ol>

      <div className="mt-10 flex items-center gap-6 rounded-lg border border-roast-700 bg-roast-900 p-6">
        <RoastCurve className="hidden h-16 w-44 shrink-0 text-ember-600 sm:block" showFirstCrack />
        <p className="text-sm text-chaff-300">
          Every batch is logged: charge temperature, turning point, first crack,
          drop. Ask at the bar and we will show you the curve for whatever is in
          your cup.
        </p>
      </div>
    </section>
  );
}
