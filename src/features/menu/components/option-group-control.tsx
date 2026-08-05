"use client";

import { RadioGroup } from "radix-ui";

import type { MenuOptionGroup } from "@/types";
import { cn, formatAed } from "@/lib/utils";

const PILL_BASE =
  "rounded-md border px-2.5 py-1.5 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember-500";
const PILL_ON = "border-ember-500 bg-ember-950 text-ember-200";
const PILL_OFF =
  "border-roast-600 bg-roast-850 text-chaff-300 hover:border-roast-500 hover:text-chaff-100";

function deltaLabel(priceDeltaFils: number): string | null {
  if (priceDeltaFils === 0) return null;
  return `+${formatAed(priceDeltaFils)}`;
}

interface OptionGroupControlProps {
  group: MenuOptionGroup;
  value: string | undefined;
  onChange: (choiceId: string | undefined) => void;
  disabled?: boolean;
}

/**
 * Required groups are a radio group — exactly one choice, arrow-key navigable.
 * Optional groups (an extra shot) are toggles, so a second click clears them.
 */
export function OptionGroupControl({
  group,
  value,
  onChange,
  disabled = false,
}: OptionGroupControlProps) {
  if (group.required) {
    return (
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <span className="db-rail w-14 shrink-0">{group.label}</span>
        <RadioGroup.Root
          value={value ?? ""}
          onValueChange={onChange}
          disabled={disabled}
          orientation="horizontal"
          aria-label={group.label}
          className="flex flex-wrap gap-1.5"
        >
          {group.choices.map((choice) => {
            const delta = deltaLabel(choice.priceDeltaFils);
            return (
              <RadioGroup.Item
                key={choice.id}
                value={choice.id}
                className={cn(
                  PILL_BASE,
                  value === choice.id ? PILL_ON : PILL_OFF,
                  disabled && "opacity-50",
                )}
              >
                {choice.label}
                {delta ? <span className="tnum ml-1.5">{delta}</span> : null}
              </RadioGroup.Item>
            );
          })}
        </RadioGroup.Root>
      </div>
    );
  }

  return (
    <div
      role="group"
      aria-label={group.label}
      className="flex flex-wrap items-center gap-x-3 gap-y-2"
    >
      <span className="db-rail w-14 shrink-0">{group.label}</span>
      <div className="flex flex-wrap gap-1.5">
        {group.choices.map((choice) => {
          const on = value === choice.id;
          const delta = deltaLabel(choice.priceDeltaFils);
          return (
            <button
              key={choice.id}
              type="button"
              aria-pressed={on}
              disabled={disabled}
              onClick={() => onChange(on ? undefined : choice.id)}
              className={cn(
                PILL_BASE,
                on ? PILL_ON : PILL_OFF,
                disabled && "opacity-50",
              )}
            >
              {choice.label}
              {delta ? <span className="tnum ml-1.5">{delta}</span> : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
