import Link from "next/link";
import { ArrowRight, Clock, MapPin, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SectionHead } from "@/components/layout/section-head";
import { SitePlan } from "./site-plan";

export const OPENING_HOURS = [
  { days: "Sunday to Thursday", time: "06:00 — 01:00" },
  { days: "Friday", time: "07:00 — 02:00" },
  { days: "Saturday", time: "07:00 — 01:00" },
];

export function VisitPanel() {
  return (
    <section aria-labelledby="visit-heading">
      <SectionHead
        id="visit-heading"
        rail="1 Demo Street · Demo District"
        title="Come and find us"
        description="Park on Demo Street. The roller door is usually up — walk in past the drum."
        action={
          <Button asChild size="lg" className="h-11 px-5">
            <Link href="/menu">
              Order ahead
              <ArrowRight data-icon="inline-end" />
            </Link>
          </Button>
        }
      />

      <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_1.1fr]">
        <div className="rounded-lg border border-roast-700 bg-roast-800 p-7">
          <div className="flex items-start gap-3">
            <Clock className="mt-0.5 size-4 shrink-0 text-ember-500" />
            <div className="w-full">
              <p className="db-rail">Hours</p>
              <dl className="mt-3 space-y-2 text-sm">
                {OPENING_HOURS.map((entry) => (
                  <div key={entry.days} className="flex justify-between gap-4">
                    <dt className="text-chaff-300">{entry.days}</dt>
                    <dd className="tnum text-chaff-400">{entry.time}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <div className="mt-7 flex items-start gap-3 border-t border-roast-700 pt-7">
            <MapPin className="mt-0.5 size-4 shrink-0 text-ember-500" />
            <div>
              <p className="db-rail">Address</p>
              <p className="mt-3 text-sm text-chaff-300">
                1 Demo Street
                <br />
                Demo District, Dubai
              </p>
            </div>
          </div>

          <div className="mt-7 flex items-start gap-3 border-t border-roast-700 pt-7">
            <Phone className="mt-0.5 size-4 shrink-0 text-ember-500" />
            <div>
              <p className="db-rail">Bar phone</p>
              <p className="tnum mt-3 text-sm text-chaff-300">
                +971 4 555 0xxx
              </p>
            </div>
          </div>
        </div>

        <SitePlan className="min-h-64" />
      </div>
    </section>
  );
}
