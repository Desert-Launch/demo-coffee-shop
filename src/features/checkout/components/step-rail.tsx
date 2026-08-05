"use client";

import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { type CheckoutStep } from "../schema";

const VISIBLE_STEPS: { id: CheckoutStep; label: string }[] = [
  { id: "fulfilment", label: "Pickup or delivery" },
  { id: "details", label: "Your details" },
  { id: "time", label: "Time" },
  { id: "review", label: "Review" },
];

/**
 * Numbered because checkout genuinely is a sequence — the numbers tell you how
 * far in you are, they are not decoration.
 */
export function StepRail({ current }: { current: CheckoutStep }) {
  const currentIndex = VISIBLE_STEPS.findIndex((step) => step.id === current);
  const done = current === "confirmation" ? VISIBLE_STEPS.length : currentIndex;

  return (
    <ol className="flex flex-wrap items-center gap-x-6 gap-y-3">
      {VISIBLE_STEPS.map((step, index) => {
        const isDone = index < done;
        const isCurrent = index === currentIndex;

        return (
          <li key={step.id} className="flex items-center gap-2">
            <span
              className={cn(
                "flex size-5 items-center justify-center rounded-full border font-mono text-2xs",
                isDone && "border-pistachio-500 bg-pistachio-950 text-pistachio-300",
                isCurrent && "border-ember-500 bg-ember-950 text-ember-300",
                !isDone &&
                  !isCurrent &&
                  "border-roast-600 bg-roast-850 text-chaff-400",
              )}
            >
              {isDone ? <Check className="size-3" /> : index + 1}
            </span>
            <span
              aria-current={isCurrent ? "step" : undefined}
              className={cn(
                "font-mono text-2xs tracking-widest uppercase",
                isCurrent ? "text-chaff-100" : "text-chaff-400",
              )}
            >
              {step.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
