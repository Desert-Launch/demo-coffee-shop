"use client";

import { RadioGroup } from "radix-ui";
import { ArrowRight, Bike, Store } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn, formatAed } from "@/lib/utils";
import { DELIVERY_FEE_FILS, type OrderType } from "@/types";

const CHOICES = [
  {
    value: "pickup" as const,
    icon: Store,
    title: "Pick it up",
    line: "1 Demo Street, Demo District. Ready in about ten minutes.",
    cost: "No fee",
  },
  {
    value: "delivery" as const,
    icon: Bike,
    title: "Have it delivered",
    line: "Anywhere inside Dubai. Usually twenty-five minutes door to door.",
    cost: `AED ${formatAed(DELIVERY_FEE_FILS)}`,
  },
];

interface FulfilmentStepProps {
  value: OrderType;
  onChange: (value: OrderType) => void;
  onNext: () => void;
}

export function FulfilmentStep({
  value,
  onChange,
  onNext,
}: FulfilmentStepProps) {
  return (
    <div>
      <h2 className="text-2xl text-chaff-50">How do you want it?</h2>
      <p className="mt-2 text-chaff-400">
        You can change this before you place the order.
      </p>

      <RadioGroup.Root
        value={value}
        onValueChange={(next) => onChange(next as OrderType)}
        aria-label="Pickup or delivery"
        className="mt-7 grid gap-4 sm:grid-cols-2"
      >
        {CHOICES.map((choice) => {
          const Icon = choice.icon;
          const selected = value === choice.value;

          return (
            <RadioGroup.Item
              key={choice.value}
              value={choice.value}
              className={cn(
                "rounded-lg border p-6 text-left transition-colors",
                selected
                  ? "border-ember-500 bg-ember-950/40"
                  : "border-roast-700 bg-roast-800 hover:border-roast-600",
              )}
            >
              <Icon
                className={cn(
                  "size-5",
                  selected ? "text-ember-400" : "text-chaff-400",
                )}
              />
              <p className="mt-4 font-display text-lg text-chaff-50">
                {choice.title}
              </p>
              <p className="mt-2 text-sm text-chaff-400">{choice.line}</p>
              <p className="db-rail mt-4">{choice.cost}</p>
            </RadioGroup.Item>
          );
        })}
      </RadioGroup.Root>

      <div className="mt-8">
        <Button size="lg" className="h-11 px-5" onClick={onNext}>
          Continue
          <ArrowRight data-icon="inline-end" />
        </Button>
      </div>
    </div>
  );
}
