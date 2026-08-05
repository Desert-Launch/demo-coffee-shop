import type { OrderStatus } from "@/types";

export interface OrderStatusMeta {
  label: string;
  /** Verb on the button that moves a ticket into this status. */
  advanceLabel: string;
  /** Shown when a column has no tickets. */
  emptyLine: string;
  /** Tailwind classes for the ticket's status stripe and chip. */
  stripeClass: string;
  chipClass: string;
}

export const ORDER_STATUS_META: Record<OrderStatus, OrderStatusMeta> = {
  new: {
    label: "New",
    advanceLabel: "Reopen",
    emptyLine: "Nothing new. The bar is caught up.",
    stripeClass: "bg-ember-500",
    chipClass: "bg-ember-950 text-ember-300 border-ember-800",
  },
  preparing: {
    label: "Preparing",
    advanceLabel: "Start",
    emptyLine: "No one is on the machine.",
    stripeClass: "bg-ember-300",
    chipClass: "bg-ember-950 text-ember-200 border-ember-800",
  },
  ready: {
    label: "Ready",
    advanceLabel: "Mark ready",
    emptyLine: "Nothing waiting on the pass.",
    stripeClass: "bg-pistachio-500",
    chipClass: "bg-pistachio-950 text-pistachio-300 border-pistachio-700",
  },
  completed: {
    label: "Completed",
    advanceLabel: "Hand over",
    emptyLine: "Nothing handed over yet.",
    stripeClass: "bg-roast-600",
    chipClass: "bg-roast-850 text-chaff-400 border-roast-600",
  },
  cancelled: {
    label: "Cancelled",
    advanceLabel: "Cancel",
    emptyLine: "No cancellations today.",
    stripeClass: "bg-danger-500",
    chipClass: "bg-danger-950 text-danger-300 border-danger-500/40",
  },
};

/** The forward step on the board. Completed and cancelled are terminal. */
export function nextStatus(status: OrderStatus): OrderStatus | null {
  switch (status) {
    case "new":
      return "preparing";
    case "preparing":
      return "ready";
    case "ready":
      return "completed";
    default:
      return null;
  }
}
