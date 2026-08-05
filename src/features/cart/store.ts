"use client";

import { create } from "zustand";

import type { CartLine, MenuItem, OptionSelection } from "@/types";

/**
 * The cart is client selection state, not domain data, so it lives in Zustand
 * rather than the in-memory store. It becomes an Order only when checkout
 * writes it through `features/orders/api.ts`.
 */

interface CartState {
  lines: CartLine[];
  isOpen: boolean;
  addLine: (
    item: MenuItem,
    selections: OptionSelection[],
    quantity: number,
    note: string,
  ) => void;
  setQuantity: (lineId: string, quantity: number) => void;
  removeLine: (lineId: string) => void;
  clear: () => void;
  setOpen: (isOpen: boolean) => void;
}

/** Two lines merge when the item, every option and the note all match. */
function sameConfiguration(
  line: CartLine,
  menuItemId: string,
  selections: OptionSelection[],
  note: string,
): boolean {
  if (line.menuItemId !== menuItemId) return false;
  if (line.note !== note) return false;
  if (line.selections.length !== selections.length) return false;

  const chosen = new Set(selections.map((s) => `${s.groupId}:${s.choiceId}`));
  return line.selections.every((s) => chosen.has(`${s.groupId}:${s.choiceId}`));
}

export const useCartStore = create<CartState>()((set) => ({
  lines: [],
  isOpen: false,

  addLine: (item, selections, quantity, note) =>
    set((state) => {
      const existing = state.lines.find((line) =>
        sameConfiguration(line, item.id, selections, note),
      );

      if (existing) {
        return {
          lines: state.lines.map((line) =>
            line.lineId === existing.lineId
              ? { ...line, quantity: Math.min(20, line.quantity + quantity) }
              : line,
          ),
        };
      }

      const unitPriceFils =
        item.basePriceFils +
        selections.reduce((sum, s) => sum + s.priceDeltaFils, 0);

      const line: CartLine = {
        lineId: crypto.randomUUID(),
        menuItemId: item.id,
        code: item.code,
        name: item.name,
        category: item.category,
        unitPriceFils,
        quantity,
        selections,
        note,
      };

      return { lines: [...state.lines, line] };
    }),

  setQuantity: (lineId, quantity) =>
    set((state) => ({
      lines:
        quantity <= 0
          ? state.lines.filter((line) => line.lineId !== lineId)
          : state.lines.map((line) =>
              line.lineId === lineId
                ? { ...line, quantity: Math.min(20, quantity) }
                : line,
            ),
    })),

  removeLine: (lineId) =>
    set((state) => ({
      lines: state.lines.filter((line) => line.lineId !== lineId),
    })),

  clear: () => set({ lines: [] }),

  setOpen: (isOpen) => set({ isOpen }),
}));
