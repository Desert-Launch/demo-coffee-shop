"use client";

import { useMemo } from "react";
import { differenceInMinutes, isToday } from "date-fns";

import { useOrders } from "@/features/orders";
import type { Order } from "@/types";

export interface BestSeller {
  code: string;
  name: string;
  quantity: number;
}

export interface DashboardStats {
  ordersToday: number;
  revenueTodayFils: number;
  avgPrepMinutes: number | null;
  /** Tickets the bar still has to act on. */
  queueCount: number;
  pickupCount: number;
  deliveryCount: number;
  cancelledCount: number;
  bestSellers: BestSeller[];
  openOrders: Order[];
}

const EMPTY: DashboardStats = {
  ordersToday: 0,
  revenueTodayFils: 0,
  avgPrepMinutes: null,
  queueCount: 0,
  pickupCount: 0,
  deliveryCount: 0,
  cancelledCount: 0,
  bestSellers: [],
  openOrders: [],
};

function buildStats(orders: Order[]): DashboardStats {
  const today = orders.filter((order) => isToday(new Date(order.placedAt)));
  const billable = today.filter((order) => order.status !== "cancelled");

  const prepTimes = today
    .filter((order) => order.readyAt !== null)
    .map((order) =>
      differenceInMinutes(new Date(order.readyAt as string), new Date(order.placedAt)),
    )
    .filter((minutes) => minutes >= 0);

  const quantities = new Map<string, BestSeller>();
  for (const order of billable) {
    for (const line of order.lines) {
      const current = quantities.get(line.code);
      quantities.set(line.code, {
        code: line.code,
        name: line.name,
        quantity: (current?.quantity ?? 0) + line.quantity,
      });
    }
  }

  return {
    ordersToday: today.length,
    revenueTodayFils: billable.reduce((sum, order) => sum + order.totalFils, 0),
    avgPrepMinutes:
      prepTimes.length > 0
        ? Math.round(prepTimes.reduce((a, b) => a + b, 0) / prepTimes.length)
        : null,
    queueCount: today.filter(
      (order) => order.status === "new" || order.status === "preparing",
    ).length,
    pickupCount: billable.filter((order) => order.type === "pickup").length,
    deliveryCount: billable.filter((order) => order.type === "delivery").length,
    cancelledCount: today.filter((order) => order.status === "cancelled").length,
    bestSellers: [...quantities.values()]
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 6),
    openOrders: today
      .filter((order) => order.status !== "completed" && order.status !== "cancelled")
      .sort(
        (a, b) =>
          new Date(a.placedAt).getTime() - new Date(b.placedAt).getTime(),
      ),
  };
}

export function useDashboard() {
  const query = useOrders();

  const stats = useMemo(
    () => (query.data ? buildStats(query.data) : EMPTY),
    [query.data],
  );

  return { ...query, stats };
}
