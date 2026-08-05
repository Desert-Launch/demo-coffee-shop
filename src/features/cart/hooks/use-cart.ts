"use client";

import { useMemo } from "react";

import type { OrderTotals, OrderType } from "@/types";
import { computeTotals } from "@/lib/pricing";
import { useCartStore } from "../store";

export function useCartLines() {
  return useCartStore((state) => state.lines);
}

/** Total number of drinks and plates, not lines. */
export function useCartCount(): number {
  return useCartStore((state) =>
    state.lines.reduce((sum, line) => sum + line.quantity, 0),
  );
}

export function useCartTotals(type: OrderType): OrderTotals {
  const lines = useCartLines();
  return useMemo(() => computeTotals(lines, type), [lines, type]);
}

export function useCartActions() {
  const addLine = useCartStore((state) => state.addLine);
  const setQuantity = useCartStore((state) => state.setQuantity);
  const removeLine = useCartStore((state) => state.removeLine);
  const clear = useCartStore((state) => state.clear);
  const setOpen = useCartStore((state) => state.setOpen);

  return useMemo(
    () => ({ addLine, setQuantity, removeLine, clear, setOpen }),
    [addLine, setQuantity, removeLine, clear, setOpen],
  );
}

export function useCartPanel() {
  const isOpen = useCartStore((state) => state.isOpen);
  const setOpen = useCartStore((state) => state.setOpen);
  return { isOpen, setOpen };
}
