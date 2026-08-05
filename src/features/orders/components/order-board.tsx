"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Plus, TriangleAlert } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { cn } from "@/lib/utils";
import { ORDER_BOARD_STATUSES, type Order, type OrderStatus } from "@/types";
import { useAdvanceOrderStatus, useCancelOrder, useOrders } from "../hooks/use-orders";
import { ORDER_STATUS_META, nextStatus } from "../status";
import { CancelOrderDialog } from "./cancel-order-dialog";
import { ManualOrderDialog } from "./manual-order-dialog";
import { OrderDetailSheet } from "./order-detail-sheet";
import { OrderTicket } from "./order-ticket";

/** The clock on each ticket only needs to be roughly right. */
const TICK_MS = 30_000;

export function OrderBoard() {
  const { data, isPending, isError, error, refetch } = useOrders();
  const advance = useAdvanceOrderStatus();
  const cancel = useCancelOrder();
  const reduceMotion = useReducedMotion();

  const [now, setNow] = useState(() => new Date());
  const [dragging, setDragging] = useState<Order | null>(null);
  const [dropTarget, setDropTarget] = useState<OrderStatus | null>(null);
  const [detail, setDetail] = useState<Order | null>(null);
  const [cancelling, setCancelling] = useState<Order | null>(null);
  const [manualOpen, setManualOpen] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), TICK_MS);
    return () => clearInterval(id);
  }, []);

  // Keep the open drawer in step with the list after a mutation lands.
  useEffect(() => {
    if (!detail || !data) return;
    const fresh = data.find((order) => order.id === detail.id);
    if (fresh && fresh !== detail) setDetail(fresh);
  }, [data, detail]);

  async function moveTo(order: Order, status: OrderStatus) {
    if (order.status === status) return;
    if (status === "cancelled") {
      setCancelling(order);
      return;
    }

    try {
      await advance.mutateAsync({ id: order.id, status });
      toast.success(`${order.reference} moved to ${ORDER_STATUS_META[status].label.toLowerCase()}`);
    } catch (cause) {
      toast.error("The ticket did not move", {
        description:
          cause instanceof Error ? cause.message : "Try moving it again.",
      });
    }
  }

  async function confirmCancel(reason: string) {
    if (!cancelling) return;
    const order = cancelling;

    try {
      await cancel.mutateAsync({ id: order.id, reason });
      setCancelling(null);
      setDetail(null);
      toast.success(`${order.reference} cancelled`);
    } catch (cause) {
      // The optimistic update has already rolled back — say what happened.
      toast.error("Order not cancelled", {
        description:
          cause instanceof Error
            ? cause.message
            : "The refund did not go through. Try cancelling again.",
      });
    }
  }

  if (isError) {
    return (
      <EmptyState
        icon={<TriangleAlert className="size-6" />}
        title="The board did not load"
        description={error.message}
        action={<Button onClick={() => void refetch()}>Try again</Button>}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-chaff-400">
          Drag a ticket between columns, or use the button on the ticket.
        </p>
        <Button size="lg" onClick={() => setManualOpen(true)}>
          <Plus data-icon="inline-start" />
          Add a walk-in
        </Button>
      </div>

      <div className="-mx-5 overflow-x-auto px-5 pb-4 md:-mx-8 md:px-8">
        <div className="grid min-w-[68rem] grid-cols-5 gap-4">
          {ORDER_BOARD_STATUSES.map((status) => {
            const meta = ORDER_STATUS_META[status];
            const orders = (data ?? []).filter(
              (order) => order.status === status,
            );
            const isTarget = dropTarget === status && dragging?.status !== status;

            return (
              <section
                key={status}
                aria-labelledby={`col-${status}`}
                onDragOver={(event) => {
                  event.preventDefault();
                  event.dataTransfer.dropEffect = "move";
                  setDropTarget(status);
                }}
                onDragLeave={() =>
                  setDropTarget((current) =>
                    current === status ? null : current,
                  )
                }
                onDrop={(event) => {
                  event.preventDefault();
                  setDropTarget(null);
                  const id = event.dataTransfer.getData("text/plain");
                  const order = (data ?? []).find((o) => o.id === id);
                  if (order) void moveTo(order, status);
                }}
                className={cn(
                  "rounded-lg border bg-roast-900 p-3 transition-colors",
                  isTarget
                    ? "border-ember-500 bg-ember-950/20"
                    : "border-roast-700",
                )}
              >
                <div className="flex items-center justify-between gap-2 px-1 pb-3">
                  <h2
                    id={`col-${status}`}
                    className="db-rail flex items-center gap-2"
                  >
                    <span
                      aria-hidden
                      className={cn(
                        "inline-block size-1.5 rounded-full",
                        meta.stripeClass,
                      )}
                    />
                    {meta.label}
                  </h2>
                  <span className="tnum text-xs text-chaff-400">
                    {isPending ? "—" : orders.length}
                  </span>
                </div>

                {isPending ? (
                  <div className="space-y-3">
                    {Array.from({ length: 2 }, (_, index) => (
                      <Skeleton key={index} className="h-44 rounded-md" />
                    ))}
                  </div>
                ) : orders.length === 0 ? (
                  <p className="rounded-md border border-dashed border-roast-700 px-3 py-8 text-center text-xs text-chaff-400">
                    {meta.emptyLine}
                  </p>
                ) : (
                  <ul className="space-y-3">
                    <AnimatePresence initial={false}>
                      {orders.map((order) => (
                        <motion.div
                          key={order.id}
                          layout={!reduceMotion}
                          initial={
                            reduceMotion ? false : { opacity: 0, scale: 0.97 }
                          }
                          animate={{ opacity: 1, scale: 1 }}
                          exit={
                            reduceMotion
                              ? { opacity: 0 }
                              : { opacity: 0, scale: 0.97 }
                          }
                          transition={{ duration: 0.18 }}
                        >
                          <OrderTicket
                            order={order}
                            now={now}
                            dragging={dragging?.id === order.id}
                            onOpen={setDetail}
                            onAdvance={(target) => {
                              const next = nextStatus(target.status);
                              if (next) void moveTo(target, next);
                            }}
                            onDragStart={setDragging}
                            onDragEnd={() => {
                              setDragging(null);
                              setDropTarget(null);
                            }}
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </ul>
                )}
              </section>
            );
          })}
        </div>
      </div>

      <OrderDetailSheet
        order={detail}
        open={detail !== null}
        onOpenChange={(open) => {
          if (!open) setDetail(null);
        }}
        onStatusChange={(order, status) => void moveTo(order, status)}
        onCancel={setCancelling}
      />

      <CancelOrderDialog
        order={cancelling}
        open={cancelling !== null}
        pending={cancel.isPending}
        onOpenChange={(open) => {
          if (!open) setCancelling(null);
        }}
        onConfirm={(reason) => void confirmCancel(reason)}
      />

      <ManualOrderDialog open={manualOpen} onOpenChange={setManualOpen} />
    </div>
  );
}
