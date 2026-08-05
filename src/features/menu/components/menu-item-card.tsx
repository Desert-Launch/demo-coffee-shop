"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { DrinkSwatch } from "@/components/shared/drink-swatch";
import { IntensityScale } from "@/components/shared/intensity-scale";
import { useCartActions } from "@/features/cart";
import { cn, formatAed } from "@/lib/utils";
import type { MenuItem, OptionSelection } from "@/types";
import { TAG_LABELS } from "../taxonomy";
import { OptionGroupControl } from "./option-group-control";

/** Required groups start on their first choice; optional groups start clear. */
function initialSelections(item: MenuItem): Record<string, string | undefined> {
  const initial: Record<string, string | undefined> = {};
  for (const group of item.optionGroups) {
    initial[group.id] = group.required ? group.choices[0]?.id : undefined;
  }
  return initial;
}

export function MenuItemCard({ item }: { item: MenuItem }) {
  const { addLine, setOpen } = useCartActions();
  const [chosen, setChosen] = useState(() => initialSelections(item));

  const selections = useMemo<OptionSelection[]>(() => {
    return item.optionGroups.flatMap((group) => {
      const choiceId = chosen[group.id];
      if (!choiceId) return [];
      const choice = group.choices.find((c) => c.id === choiceId);
      if (!choice) return [];
      return [
        {
          groupId: group.id,
          groupLabel: group.label,
          choiceId: choice.id,
          choiceLabel: choice.label,
          priceDeltaFils: choice.priceDeltaFils,
        },
      ];
    });
  }, [item.optionGroups, chosen]);

  const unitPriceFils =
    item.basePriceFils +
    selections.reduce((sum, s) => sum + s.priceDeltaFils, 0);

  function handleAdd() {
    addLine(item, selections, 1, "");
    toast.success(`${item.name} added to your order`, {
      action: { label: "View order", onClick: () => setOpen(true) },
    });
  }

  return (
    <article
      className={cn(
        "relative flex flex-col rounded-lg border border-roast-700 bg-roast-800 transition-colors",
        item.available
          ? "hover:border-roast-600"
          : "border-roast-700/70 bg-roast-850",
      )}
    >
      {/* Label head */}
      <div className="flex items-start gap-4 p-5">
        <DrinkSwatch
          category={item.category}
          className={cn("h-24 w-16", !item.available && "opacity-40 grayscale")}
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <span className="db-rail">{item.code}</span>
            <IntensityScale value={item.intensity} />
          </div>

          <h3 className="mt-2 font-display text-xl leading-tight text-chaff-50">
            {item.name}
          </h3>
          <p className="mt-1.5 text-sm leading-snug text-chaff-400">
            {item.description}
          </p>

          {item.tags.length > 0 ? (
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {item.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-sm border border-roast-600 px-1.5 py-0.5 font-mono text-2xs tracking-wide text-chaff-400 uppercase"
                >
                  {TAG_LABELS[tag]}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>

      {/* Options, below the perforation */}
      {item.optionGroups.length > 0 ? (
        <div className="db-perf mx-5 flex flex-col gap-3 py-4">
          {item.optionGroups.map((group) => (
            <OptionGroupControl
              key={group.id}
              group={group}
              value={chosen[group.id]}
              disabled={!item.available}
              onChange={(choiceId) =>
                setChosen((current) => ({ ...current, [group.id]: choiceId }))
              }
            />
          ))}
        </div>
      ) : null}

      {/* Price and action */}
      <div className="db-perf mx-5 mt-auto flex items-center justify-between gap-4 py-4">
        <p className="tnum text-lg text-ember-400">
          <span className="text-2xs text-chaff-400">AED </span>
          {formatAed(unitPriceFils)}
        </p>

        {item.available ? (
          <Button size="lg" onClick={handleAdd}>
            <Plus data-icon="inline-start" />
            Add to order
          </Button>
        ) : (
          <span className="rounded-sm border border-danger-500/40 bg-danger-950 px-2.5 py-1.5 font-mono text-2xs tracking-widest text-danger-300 uppercase">
            Sold out today
          </span>
        )}
      </div>
    </article>
  );
}
