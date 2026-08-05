"use client";

import { Minus, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DrinkSwatch } from "@/components/shared/drink-swatch";
import { formatAed } from "@/lib/utils";
import type { CartLine } from "@/types";

interface CartLineRowProps {
  line: CartLine;
  onQuantityChange: (lineId: string, quantity: number) => void;
  onRemove: (lineId: string) => void;
}

export function CartLineRow({
  line,
  onQuantityChange,
  onRemove,
}: CartLineRowProps) {
  const options = line.selections.map((s) => s.choiceLabel).join(" · ");

  return (
    <li className="flex gap-4 border-b border-roast-700 py-4 last:border-b-0">
      <DrinkSwatch category={line.category} className="h-16 w-11" />

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="db-rail">{line.code}</p>
            <p className="mt-1 truncate font-display text-base font-semibold text-chaff-50">
              {line.name}
            </p>
          </div>
          <p className="tnum shrink-0 text-sm text-chaff-100">
            {formatAed(line.unitPriceFils * line.quantity)}
          </p>
        </div>

        {options ? (
          <p className="mt-1 text-xs text-chaff-400">{options}</p>
        ) : null}
        {line.note ? (
          <p className="mt-1 text-xs text-ember-300">Note: {line.note}</p>
        ) : null}

        <div className="mt-3 flex items-center gap-1">
          <Button
            size="icon-sm"
            variant="outline"
            aria-label={`Remove one ${line.name}`}
            onClick={() => onQuantityChange(line.lineId, line.quantity - 1)}
          >
            <Minus />
          </Button>
          <span
            className="tnum w-8 text-center text-sm text-chaff-100"
            aria-live="polite"
          >
            {line.quantity}
          </span>
          <Button
            size="icon-sm"
            variant="outline"
            aria-label={`Add one ${line.name}`}
            disabled={line.quantity >= 20}
            onClick={() => onQuantityChange(line.lineId, line.quantity + 1)}
          >
            <Plus />
          </Button>
          <Button
            size="icon-sm"
            variant="ghost"
            className="ml-2 text-chaff-400 hover:text-danger-300"
            aria-label={`Take ${line.name} out of your order`}
            onClick={() => onRemove(line.lineId)}
          >
            <Trash2 />
          </Button>
        </div>
      </div>
    </li>
  );
}
