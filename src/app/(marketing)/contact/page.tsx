import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { SitePlan } from "@/components/marketing/site-plan";
import { OPENING_HOURS } from "@/components/marketing/visit-panel";
import { ContactForm } from "@/features/contact";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Warehouse 14, street 8, Al Quoz 3, Dubai. Hours, phone and a message form for wholesale, events and visits.",
};

export default function ContactPage() {
  return (
    <PageContainer className="py-14">
      <div className="border-b border-roast-700 pb-10">
        <p className="db-rail">Contact · the bar answers, not a call centre</p>
        <h1 className="mt-5 max-w-2xl text-4xl leading-tight tracking-tighter text-chaff-50 md:text-5xl">
          Ask us anything about beans, bookings or a bad cup.
        </h1>
      </div>

      <div className="grid gap-10 pt-12 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
        <div className="space-y-8">
          <SitePlan className="min-h-64" />

          <dl className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-ember-500" />
              <div>
                <dt className="db-rail">Address</dt>
                <dd className="mt-2 text-sm text-chaff-300">
                  Warehouse 14, street 8
                  <br />
                  Al Quoz Industrial 3, Dubai
                </dd>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="mt-0.5 size-4 shrink-0 text-ember-500" />
              <div className="w-full">
                <dt className="db-rail">Hours</dt>
                <dd className="mt-2 space-y-1 text-sm">
                  {OPENING_HOURS.map((entry) => (
                    <span
                      key={entry.days}
                      className="flex justify-between gap-4"
                    >
                      <span className="text-chaff-300">{entry.days}</span>
                      <span className="tnum text-chaff-400">{entry.time}</span>
                    </span>
                  ))}
                </dd>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="mt-0.5 size-4 shrink-0 text-ember-500" />
              <div>
                <dt className="db-rail">Bar phone</dt>
                <dd className="tnum mt-2 text-sm text-chaff-300">
                  +971 4 501 0714
                </dd>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 size-4 shrink-0 text-ember-500" />
              <div>
                <dt className="db-rail">Wholesale</dt>
                <dd className="mt-2 text-sm text-chaff-300">
                  beans@duneandbean.example
                </dd>
              </div>
            </div>
          </dl>
        </div>

        <ContactForm />
      </div>
    </PageContainer>
  );
}
