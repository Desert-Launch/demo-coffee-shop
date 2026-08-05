"use client";

import { ArrowRight, Bike, Store } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn, formatAed, formatElapsed, minutesSince } from "@/lib/utils";
import type { Order } from "@/types";
import { ORDER_STATUS_META, nextStatus } from "../status";

/** After this long on the bar, the clock on a live ticket turns red. */
const LATE_AFTER_MINUTES = 12;

interface OrderTicketProps {
  order: Order;
  now: Date;
  onOpen: (order: Order) => void;
  onAdvance: (order: Order) => void;
  onDragStart: (order: Order) => void;
  onDragEnd: () => void;
  dragging: boolean;
}

/**
 * A ticket, printed the way the bar's thermal printer would print it: mono
 * throughout, perforated between sections, torn along the bottom.
 */
export function OrderTicket({
  order,
  now,
  onOpen,
  onAdvance,
  onDragStart,
  onDragEnd,
  dragging,
}: OrderTicketProps) {
  const meta = ORDER_STATUS_META[order.status];
  const advance = nextStatus(order.status);
  const elapsed = minutesSince(order.placedAt, now);
  const live = order.status === "new" || order.status === "preparing";
  const late = live && elapsed >= LATE_AFTER_MINUTES;
  const TypeIcon = order.type === "delivery" ? Bike : Store;

  return (
    <li
      draggable
      onDragStart={(event) => {
        event.dataTransfer.setData("text/plain", order.id);
        event.dataTransfer.effectAllowed = "move";
        onDragStart(order);
      }}
      onDragEnd={onDragEnd}
      className={cn(
        "cursor-grab transition-opacity active:cursor-grabbing",
        dragging && "opacity-40",
      )}
    >
      <article className="border border-roast-700 bg-roast-800">
        <button
          type="button"
          onClick={() => onOpen(order)}
          className="block w-full text-left"
          aria-label={`Open ticket ${order.reference} for ${order.customer.name}`}
        >
          <div className="flex">
            <span
              aria-hidden
              className={cn("w-1 shrink-0", meta.stripeClass)}
            />
            <div className="min-w-0 flex-1 p-4">
              <div className="flex items-start justify-between gap-3">
                <span className="tnum text-sm text-chaff-50">
                  {order.reference}
                </span>
                <span
                  className={cn(
                    "tnum text-xs",
                    late ? "text-danger-300" : "text-chaff-400",
                  )}
                >
                  {formatElapsed(elapsed)}
                </span>
              </div>

              <p className="mt-1.5 truncate text-sm text-chaff-100">
                {order.customer.name}
              </p>

              <p className="db-rail mt-1 flex items-center gap-1.5">
                <TypeIcon className="size-3" />
                {order.type === "delivery"
                  ? (order.customer.address?.area ?? "Delivery")
                  : "Pickup"}
                {order.channel === "walk-in" ? " · walk-in" : null}
              </p>

              <ul className="db-perf mt-3 space-y-2 pt-3">
                {order.lines.map((line) => (
                  <li key={line.id} className="text-xs">
                    <span className="tnum text-chaff-400">
                      {line.quantity}×
                    </span>{" "}
                    <span className="text-chaff-100">{line.name}</span>
                    {line.selections.length > 0 ? (
                      <span className="mt-0.5 block pl-5 text-chaff-400">
                        {line.selections.map((s) => s.choiceLabel).join(" · ")}
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>

              {order.staffNote ? (
                <p className="mt-3 rounded-sm border border-ember-800 bg-ember-950 px-2 py-1.5 text-xs text-ember-200">
                  {order.staffNote}
                </p>
              ) : null}

              {order.status === "cancelled" && order.cancellationReason ? (
                <p className="mt-3 text-xs text-danger-300">
                  {order.cancellationReason}
                </p>
              ) : null}
            </div>
          </div>
        </button>

        <div className="db-perf mx-4 flex items-center justify-between gap-3 py-3">
          <span className="tnum text-sm text-ember-400">
            AED {formatAed(order.totalFils)}
          </span>
          {advance ? (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onAdvance(order)}
            >
              {ORDER_STATUS_META[advance].advanceLabel}
              <ArrowRight data-icon="inline-end" />
            </Button>
          ) : null}
        </div>
      </article>
      <div className="db-ticket-edge bg-roast-800" />
    </li>
  );
}
