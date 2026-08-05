"use client";

import Link from "next/link";
import { ArrowRight, Bike, Receipt, Store, Timer, TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { StatCard } from "@/components/shared/stat-card";
import { SectionHead } from "@/components/layout/section-head";
import { ORDER_STATUS_META } from "@/features/orders";
import { useStaffStore } from "@/features/staff";
import { formatAed, formatTime } from "@/lib/utils";
import { useDashboard } from "../hooks/use-dashboard";
import { BestSellersChart } from "./best-sellers-chart";

export function Overview() {
  const { stats, isPending, isError, error, refetch } = useDashboard();
  const staff = useStaffStore((state) => state.current);

  if (isError) {
    return (
      <EmptyState
        icon={<TriangleAlert className="size-6" />}
        title="Today's numbers did not load"
        description={error.message}
        action={<Button onClick={() => void refetch()}>Try again</Button>}
      />
    );
  }

  return (
    <div className="space-y-10">
      <div>
        <p className="db-rail">Al Quoz 3 · today</p>
        <h2 className="mt-3 text-3xl text-chaff-50">
          Morning, {staff.name.split(" ")[0]}.
        </h2>
        <p className="mt-2 text-chaff-400">
          {isPending
            ? "Pulling today's tickets…"
            : stats.queueCount > 0
              ? `${stats.queueCount} ${stats.queueCount === 1 ? "ticket" : "tickets"} still open on the bar.`
              : "The bar is clear. Nothing waiting."}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {isPending ? (
          Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-32 rounded-lg" />
          ))
        ) : (
          <>
            <StatCard
              label="Orders today"
              value={String(stats.ordersToday)}
              detail={`${stats.pickupCount} pickup · ${stats.deliveryCount} delivery`}
              icon={<Receipt className="size-4" />}
            />
            <StatCard
              label="Taken today"
              value={`AED ${formatAed(stats.revenueTodayFils)}`}
              detail="Cancelled tickets excluded"
              icon={<Store className="size-4" />}
            />
            <StatCard
              label="Average prep"
              value={
                stats.avgPrepMinutes === null
                  ? "—"
                  : `${stats.avgPrepMinutes} min`
              }
              detail="From ticket in to ready on the pass"
              icon={<Timer className="size-4" />}
            />
            <StatCard
              label="In the queue"
              value={String(stats.queueCount)}
              detail={
                stats.cancelledCount > 0
                  ? `${stats.cancelledCount} cancelled today`
                  : "No cancellations today"
              }
              icon={<Bike className="size-4" />}
            />
          </>
        )}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section
          aria-labelledby="bestsellers-heading"
          className="rounded-lg border border-roast-700 bg-roast-800 p-6"
        >
          <SectionHead
            id="bestsellers-heading"
            rail="Best sellers · today, by cups"
            title="What the bar is actually making"
          />
          <div className="mt-6">
            {isPending ? (
              <Skeleton className="h-72 w-full rounded-md" />
            ) : (
              <BestSellersChart data={stats.bestSellers} />
            )}
          </div>
        </section>

        <section
          aria-labelledby="queue-heading"
          className="rounded-lg border border-roast-700 bg-roast-800 p-6"
        >
          <SectionHead
            id="queue-heading"
            rail={`Open tickets · ${stats.openOrders.length}`}
            title="The live queue"
            action={
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/orders">
                  Open the board
                  <ArrowRight data-icon="inline-end" />
                </Link>
              </Button>
            }
          />

          <div className="mt-6">
            {isPending ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }, (_, index) => (
                  <Skeleton key={index} className="h-14 rounded-md" />
                ))}
              </div>
            ) : stats.openOrders.length === 0 ? (
              <EmptyState
                title="Nothing waiting"
                description="Every ticket taken today has been handed over."
              />
            ) : (
              <ul className="divide-y divide-roast-700">
                {stats.openOrders.slice(0, 6).map((order) => {
                  const meta = ORDER_STATUS_META[order.status];
                  const items = order.lines.reduce(
                    (sum, line) => sum + line.quantity,
                    0,
                  );

                  return (
                    <li
                      key={order.id}
                      className="flex items-center justify-between gap-4 py-3"
                    >
                      <div className="min-w-0">
                        <p className="tnum text-sm text-chaff-50">
                          {order.reference}
                        </p>
                        <p className="truncate text-xs text-chaff-400">
                          {order.customer.name} · {items}{" "}
                          {items === 1 ? "item" : "items"} ·{" "}
                          {order.type === "delivery" ? "delivery" : "pickup"}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-3">
                        <span className="tnum text-xs text-chaff-400">
                          {formatTime(order.placedAt)}
                        </span>
                        <span
                          className={`rounded-sm border px-1.5 py-0.5 font-mono text-2xs tracking-widest uppercase ${meta.chipClass}`}
                        >
                          {meta.label}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
