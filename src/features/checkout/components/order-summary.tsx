"use client";

import { DrinkSwatch } from "@/components/shared/drink-swatch";
import { computeTotals } from "@/lib/pricing";
import { formatAed } from "@/lib/utils";
import type { CartLine, OrderType } from "@/types";

interface OrderSummaryProps {
  lines: CartLine[];
  type: OrderType;
}

/** Sits beside the wizard the whole way through, so the total is never a surprise. */
export function OrderSummary({ lines, type }: OrderSummaryProps) {
  const totals = computeTotals(lines, type);
  const count = lines.reduce((sum, line) => sum + line.quantity, 0);

  return (
    <aside
      aria-label="Order summary"
      className="rounded-lg border border-roast-700 bg-roast-800 p-6"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="db-rail">Your order</p>
        <p className="db-rail">
          {count} {count === 1 ? "item" : "items"}
        </p>
      </div>

      <ul className="mt-5 space-y-4">
        {lines.map((line) => (
          <li key={line.lineId} className="flex gap-3">
            <DrinkSwatch category={line.category} className="h-12 w-8" />
            <div className="min-w-0 flex-1">
              <div className="flex justify-between gap-3">
                <p className="truncate text-sm text-chaff-100">
                  <span className="tnum text-chaff-400">{line.quantity}×</span>{" "}
                  {line.name}
                </p>
                <p className="tnum shrink-0 text-sm text-chaff-100">
                  {formatAed(line.unitPriceFils * line.quantity)}
                </p>
              </div>
              {line.selections.length > 0 ? (
                <p className="mt-0.5 truncate text-xs text-chaff-400">
                  {line.selections.map((s) => s.choiceLabel).join(" · ")}
                </p>
              ) : null}
            </div>
          </li>
        ))}
      </ul>

      <dl className="mt-6 space-y-2 border-t border-roast-700 pt-5 text-sm">
        <div className="flex justify-between">
          <dt className="text-chaff-400">Subtotal</dt>
          <dd className="tnum text-chaff-100">
            {formatAed(totals.subtotalFils)}
          </dd>
        </div>
        {totals.deliveryFeeFils > 0 ? (
          <div className="flex justify-between">
            <dt className="text-chaff-400">Delivery</dt>
            <dd className="tnum text-chaff-100">
              {formatAed(totals.deliveryFeeFils)}
            </dd>
          </div>
        ) : null}
        <div className="flex justify-between">
          <dt className="text-chaff-400">VAT 5%</dt>
          <dd className="tnum text-chaff-100">{formatAed(totals.vatFils)}</dd>
        </div>
        <div className="flex justify-between border-t border-roast-700 pt-3">
          <dt className="font-display text-base text-chaff-50">Total</dt>
          <dd className="tnum text-base text-ember-400">
            AED {formatAed(totals.totalFils)}
          </dd>
        </div>
      </dl>
    </aside>
  );
}
