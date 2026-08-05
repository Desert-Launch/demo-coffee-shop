/**
 * The demo "backend".
 *
 * A module-level singleton holding menu items and orders. No React, no
 * framework imports, no persistence — the data re-seeds whenever the module is
 * evaluated fresh (a hard refresh), and every add/edit/delete survives for the
 * rest of the browser session.
 *
 * Nothing outside `src/lib/store` and the feature `api.ts` files may import
 * this module. UI reaches it through: component → feature hook → api.ts → store.
 */

import type { MenuItem, Order, OrderStatus } from "@/types";
import { createSeedMenu, createSeedOrders } from "./seed";

interface Database {
  menu: MenuItem[];
  orders: Order[];
  /** Incremented for each new order so references stay sequential in a session. */
  nextReference: number;
}

function createDatabase(): Database {
  const now = new Date();
  const menu = createSeedMenu(now);
  const orders = createSeedOrders(menu, now);

  return { menu, orders, nextReference: 4828 };
}

let db: Database = createDatabase();

/** Wired to the reset control in the admin footer. */
export function resetStore(): void {
  db = createDatabase();
}

export function newId(): string {
  return crypto.randomUUID();
}

export function nextOrderReference(): string {
  const reference = `DB-${db.nextReference}`;
  db.nextReference += 1;
  return reference;
}

/* --- Menu ----------------------------------------------------------------- */

export function selectMenu(): MenuItem[] {
  return db.menu.map((item) => structuredClone(item));
}

export function selectMenuItem(id: string): MenuItem | undefined {
  const found = db.menu.find((item) => item.id === id);
  return found ? structuredClone(found) : undefined;
}

export function insertMenuItem(item: MenuItem): MenuItem {
  db.menu = [item, ...db.menu];
  return structuredClone(item);
}

export function patchMenuItem(
  id: string,
  changes: Partial<Omit<MenuItem, "id" | "createdAt">>,
): MenuItem {
  const index = db.menu.findIndex((item) => item.id === id);
  if (index === -1) throw new Error(`No menu item with id ${id}`);

  const updated: MenuItem = { ...db.menu[index], ...changes };
  db.menu = db.menu.map((item, i) => (i === index ? updated : item));
  return structuredClone(updated);
}

export function removeMenuItem(id: string): void {
  const exists = db.menu.some((item) => item.id === id);
  if (!exists) throw new Error(`No menu item with id ${id}`);
  db.menu = db.menu.filter((item) => item.id !== id);
}

/* --- Orders --------------------------------------------------------------- */

export function selectOrders(): Order[] {
  return db.orders.map((order) => structuredClone(order));
}

export function selectOrder(id: string): Order | undefined {
  const found = db.orders.find((order) => order.id === id);
  return found ? structuredClone(found) : undefined;
}

export function insertOrder(order: Order): Order {
  db.orders = [order, ...db.orders];
  return structuredClone(order);
}

export function patchOrder(id: string, changes: Partial<Order>): Order {
  const index = db.orders.findIndex((order) => order.id === id);
  if (index === -1) throw new Error(`No order with id ${id}`);

  const updated: Order = { ...db.orders[index], ...changes };
  db.orders = db.orders.map((order, i) => (i === index ? updated : order));
  return structuredClone(updated);
}

/** Timestamps that must be stamped whenever a status changes. */
export function stampsForStatus(
  status: OrderStatus,
  at: Date,
): Pick<Order, "readyAt" | "completedAt" | "cancelledAt"> {
  const iso = at.toISOString();
  return {
    readyAt: status === "ready" || status === "completed" ? iso : null,
    completedAt: status === "completed" ? iso : null,
    cancelledAt: status === "cancelled" ? iso : null,
  };
}
