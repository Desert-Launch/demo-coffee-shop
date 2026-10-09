"use client";

import { useEffect, useState, type ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useCartStore } from "@/features/cart";
import { makeQueryClient } from "@/lib/query-client";
import { onStoreChange } from "@/lib/store/persist";

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(makeQueryClient);

  // An order placed in another tab lands in this one's store; refetch so an
  // open board shows it without a refresh.
  useEffect(() => onStoreChange(() => void queryClient.invalidateQueries()), [queryClient]);

  // The cart skips hydration at creation; restore it once, after the first
  // render, so the server and client markup match.
  useEffect(() => {
    void useCartStore.persist.rehydrate();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider delayDuration={200}>{children}</TooltipProvider>
      <Toaster theme="dark" position="bottom-right" closeButton />
    </QueryClientProvider>
  );
}
