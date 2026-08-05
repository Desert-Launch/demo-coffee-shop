"use client";

import Link from "next/link";
import { addMinutes, format } from "date-fns";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ClipboardList } from "lucide-react";

import { Button } from "@/components/ui/button";
import { estimateReadyMinutes } from "@/features/orders";
import { formatAed } from "@/lib/utils";
import type { Order } from "@/types";

export function ConfirmationStep({ order }: { order: Order }) {
  const reduceMotion = useReducedMotion();
  const minutes = estimateReadyMinutes(order);
  const readyBy = order.scheduledFor
    ? new Date(order.scheduledFor)
    : addMinutes(new Date(order.placedAt), minutes);

  return (
    <motion.div
      initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
      className="mx-auto max-w-lg"
    >
      <p className="db-rail text-pistachio-300">Order placed</p>
      <h1 className="mt-4 text-4xl leading-tight tracking-tighter text-chaff-50">
        {order.type === "delivery"
          ? "It is on the board and a driver is assigned."
          : "It is on the board. Come to the pass and give the number."}
      </h1>

      {/* The customer's half of the ticket — the same paper the bar works from. */}
      <div className="mt-9">
        <div className="rounded-t-lg border border-b-0 border-roast-700 bg-roast-800 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="db-rail">Order number</p>
              <p className="tnum mt-1 text-3xl text-ember-400">
                {order.reference}
              </p>
            </div>
            <div className="text-right">
              <p className="db-rail">
                {order.type === "delivery" ? "Arriving" : "Ready by"}
              </p>
              <p className="tnum mt-1 text-3xl text-chaff-50">
                {format(readyBy, "HH:mm")}
              </p>
            </div>
          </div>

          <p className="mt-3 text-sm text-chaff-400">
            {order.scheduledFor
              ? "Scheduled — we start it so it lands on the minute."
              : `About ${minutes} minutes from now.`}
          </p>

          <ul className="db-perf mt-6 space-y-3 pt-5">
            {order.lines.map((line) => (
              <li key={line.id} className="flex justify-between gap-4 text-sm">
                <span className="min-w-0">
                  <span className="tnum text-chaff-400">{line.quantity}×</span>{" "}
                  <span className="text-chaff-100">{line.name}</span>
                  {line.selections.length > 0 ? (
                    <span className="mt-0.5 block text-xs text-chaff-400">
                      {line.selections.map((s) => s.choiceLabel).join(" · ")}
                    </span>
                  ) : null}
                </span>
                <span className="tnum shrink-0 text-chaff-100">
                  {formatAed(line.unitPriceFils * line.quantity)}
                </span>
              </li>
            ))}
          </ul>

          <div className="db-perf mt-5 flex justify-between pt-5">
            <span className="font-display text-base text-chaff-50">
              Paid at the bar
            </span>
            <span className="tnum text-base text-ember-400">
              AED {formatAed(order.totalFils)}
            </span>
          </div>
        </div>
        <div className="db-ticket-edge bg-roast-800" />
      </div>

      <div className="mt-9 flex flex-wrap gap-3">
        <Button asChild size="lg" className="h-11 px-5">
          <Link href="/menu">
            Order something else
            <ArrowRight data-icon="inline-end" />
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="h-11 px-5">
          <Link href="/admin/orders">
            <ClipboardList data-icon="inline-start" />
            Watch it on the bar board
          </Link>
        </Button>
      </div>
    </motion.div>
  );
}
