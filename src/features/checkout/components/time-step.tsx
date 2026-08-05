"use client";

import { useMemo } from "react";
import { RadioGroup } from "radix-ui";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { OrderType } from "@/types";
import { ASAP_SLOT, generateSlots } from "../slots";

interface TimeStepProps {
  value: string;
  type: OrderType;
  /** Passed in from the wizard so the list is generated once, not per render. */
  now: Date;
  onChange: (value: string) => void;
  onBack: () => void;
  onNext: () => void;
}

export function TimeStep({
  value,
  type,
  now,
  onChange,
  onBack,
  onNext,
}: TimeStepProps) {
  const slots = useMemo(() => generateSlots(now), [now]);
  const leadMinutes = type === "delivery" ? 25 : 10;

  return (
    <div>
      <h2 className="text-2xl text-chaff-50">When do you want it?</h2>
      <p className="mt-2 text-chaff-400">
        Everything is made to order, so we start when the slot comes up rather
        than holding it under a lamp.
      </p>

      <RadioGroup.Root
        value={value}
        onValueChange={onChange}
        aria-label="Collection time"
        className="mt-7 space-y-4"
      >
        <RadioGroup.Item
          value={ASAP_SLOT}
          className={cn(
            "flex w-full items-center justify-between gap-4 rounded-lg border p-5 text-left transition-colors",
            value === ASAP_SLOT
              ? "border-ember-500 bg-ember-950/40"
              : "border-roast-700 bg-roast-800 hover:border-roast-600",
          )}
        >
          <span>
            <span className="block font-display text-lg text-chaff-50">
              As soon as possible
            </span>
            <span className="mt-1 block text-sm text-chaff-400">
              Straight onto the queue when you place it.
            </span>
          </span>
          <span className="tnum shrink-0 text-sm text-ember-400">
            ≈ {leadMinutes} min
          </span>
        </RadioGroup.Item>

        <div className="rounded-lg border border-roast-700 bg-roast-800 p-5">
          <p className="db-rail">Or pick a time</p>
          <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-5">
            {slots.map((slot) => (
              <RadioGroup.Item
                key={slot.value}
                value={slot.value}
                disabled={slot.disabled}
                className={cn(
                  "tnum rounded-md border px-2 py-2 text-sm transition-colors",
                  value === slot.value
                    ? "border-ember-500 bg-ember-950 text-ember-200"
                    : "border-roast-600 bg-roast-850 text-chaff-300 hover:border-roast-500",
                  slot.disabled &&
                    "cursor-not-allowed border-roast-700 text-chaff-600 line-through hover:border-roast-700",
                )}
              >
                {slot.label}
              </RadioGroup.Item>
            ))}
          </div>
          <p className="mt-4 text-xs text-chaff-400">
            Struck-through times fall outside opening hours — the bar shuts at
            01:00.
          </p>
        </div>
      </RadioGroup.Root>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button
          variant="outline"
          size="lg"
          className="h-11 px-5"
          onClick={onBack}
        >
          <ArrowLeft data-icon="inline-start" />
          Back
        </Button>
        <Button size="lg" className="h-11 px-5" onClick={onNext}>
          Continue
          <ArrowRight data-icon="inline-end" />
        </Button>
      </div>
    </div>
  );
}
