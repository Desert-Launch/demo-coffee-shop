"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useCartActions } from "@/features/cart";
import { resetDemoData } from "../api";

/** Reseeds the day, empties the cart and drops every cached query. */
export function useResetDemoData() {
  const queryClient = useQueryClient();
  const { clear } = useCartActions();

  return useMutation<void, Error, void>({
    mutationFn: resetDemoData,
    onSuccess: () => {
      clear();
      void queryClient.invalidateQueries();
    },
  });
}
