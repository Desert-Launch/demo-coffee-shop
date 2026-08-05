"use client";

import { useEffect, useState } from "react";
import { Bike, Loader2, Minus, Plus, Store, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { computeTotals } from "@/lib/pricing";
import { cn, formatAed, formatDayTime } from "@/lib/utils";
import { ORDER_STATUSES, type Order, type OrderLine, type OrderStatus } from "@/types";
import { useUpdateOrderLines, useUpdateStaffNote } from "../hooks/use-orders";
import { ORDER_STATUS_META } from "../status";

interface OrderDetailSheetProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChange: (order: Order, status: OrderStatus) => void;
  onCancel: (order: Order) => void;
}

function linesEqual(a: OrderLine[], b: OrderLine[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((line, index) => {
    const other = b[index];
    return line.id === other.id && line.quantity === other.quantity;
  });
}

export function OrderDetailSheet({
  order,
  open,
  onOpenChange,
  onStatusChange,
  onCancel,
}: OrderDetailSheetProps) {
  const updateLines = useUpdateOrderLines();
  const updateNote = useUpdateStaffNote();

  const [draftLines, setDraftLines] = useState<OrderLine[]>([]);
  const [note, setNote] = useState("");

  useEffect(() => {
    if (order) {
      setDraftLines(order.lines);
      setNote(order.staffNote);
    }
  }, [order]);

  if (!order) return null;

  const totals = computeTotals(draftLines, order.type);
  const linesDirty = !linesEqual(draftLines, order.lines);
  const noteDirty = note !== order.staffNote;
  const terminal = order.status === "completed" || order.status === "cancelled";
  const TypeIcon = order.type === "delivery" ? Bike : Store;

  function setQuantity(lineId: string, quantity: number) {
    setDraftLines((lines) =>
      quantity <= 0
        ? lines.filter((line) => line.id !== lineId)
        : lines.map((line) =>
            line.id === lineId
              ? { ...line, quantity: Math.min(20, quantity) }
              : line,
          ),
    );
  }

  async function saveLines() {
    if (!order) return;
    if (draftLines.length === 0) {
      toast.error("An order needs at least one item", {
        description: "Cancel the order instead of emptying it.",
      });
      return;
    }
    try {
      await updateLines.mutateAsync({ id: order.id, lines: draftLines });
      toast.success("Order updated", {
        description: `${order.reference} now totals AED ${formatAed(totals.totalFils)}.`,
      });
    } catch (cause) {
      toast.error("Order not updated", {
        description:
          cause instanceof Error ? cause.message : "Try saving again.",
      });
    }
  }

  async function saveNote() {
    if (!order) return;
    try {
      await updateNote.mutateAsync({ id: order.id, staffNote: note });
      toast.success("Note saved");
    } catch (cause) {
      toast.error("Note not saved", {
        description:
          cause instanceof Error ? cause.message : "Try saving again.",
      });
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col border-roast-700 bg-roast-900 sm:max-w-lg"
      >
        <SheetHeader className="border-b border-roast-700">
          <SheetTitle className="tnum text-xl">{order.reference}</SheetTitle>
          <SheetDescription className="text-chaff-400">
            Taken {formatDayTime(order.placedAt)} ·{" "}
            {order.channel === "walk-in" ? "walk-in at the till" : "online"}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-7 overflow-y-auto px-4 py-5">
          {/* Status */}
          <section>
            <p className="db-rail">Status</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {ORDER_STATUSES.map((status) => {
                const meta = ORDER_STATUS_META[status];
                const active = order.status === status;

                return (
                  <button
                    key={status}
                    type="button"
                    aria-pressed={active}
                    onClick={() =>
                      status === "cancelled"
                        ? onCancel(order)
                        : onStatusChange(order, status)
                    }
                    className={cn(
                      "rounded-md border px-2.5 py-1.5 font-mono text-2xs tracking-widest uppercase transition-colors",
                      active
                        ? meta.chipClass
                        : "border-roast-600 bg-roast-850 text-chaff-400 hover:text-chaff-100",
                    )}
                  >
                    {meta.label}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Customer */}
          <section className="rounded-lg border border-roast-700 bg-roast-800 p-5">
            <p className="db-rail flex items-center gap-1.5">
              <TypeIcon className="size-3" />
              {order.type === "delivery" ? "Delivery" : "Pickup"}
            </p>
            <p className="mt-3 text-base text-chaff-50">
              {order.customer.name}
            </p>
            {order.customer.phone ? (
              <p className="tnum mt-1 text-sm text-chaff-400">
                {order.customer.phone}
              </p>
            ) : null}
            {order.customer.email ? (
              <p className="mt-0.5 text-sm text-chaff-400">
                {order.customer.email}
              </p>
            ) : null}
            {order.customer.address ? (
              <p className="mt-3 border-t border-roast-700 pt-3 text-sm text-chaff-300">
                {order.customer.address.line1}
                <br />
                {order.customer.address.area}, {order.customer.address.city}
                {order.customer.address.notes ? (
                  <>
                    <br />
                    <span className="text-chaff-400">
                      {order.customer.address.notes}
                    </span>
                  </>
                ) : null}
              </p>
            ) : null}
            {order.scheduledFor ? (
              <p className="mt-3 text-sm text-ember-300">
                Scheduled for {formatDayTime(order.scheduledFor)}
              </p>
            ) : null}
          </section>

          {/* Items */}
          <section>
            <div className="flex items-center justify-between gap-3">
              <p className="db-rail">Items</p>
              {linesDirty ? (
                <Button
                  size="sm"
                  onClick={() => void saveLines()}
                  disabled={updateLines.isPending}
                >
                  {updateLines.isPending ? (
                    <>
                      <Loader2
                        data-icon="inline-start"
                        className="animate-spin"
                      />
                      Saving…
                    </>
                  ) : (
                    "Save changes"
                  )}
                </Button>
              ) : null}
            </div>

            <ul className="mt-3 divide-y divide-roast-700 rounded-lg border border-roast-700 bg-roast-800">
              {draftLines.map((line) => (
                <li key={line.id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="db-rail">{line.code}</p>
                      <p className="mt-1 text-sm text-chaff-50">{line.name}</p>
                      {line.selections.length > 0 ? (
                        <p className="mt-0.5 text-xs text-chaff-400">
                          {line.selections
                            .map((s) => `${s.groupLabel}: ${s.choiceLabel}`)
                            .join(" · ")}
                        </p>
                      ) : null}
                      {line.note ? (
                        <p className="mt-1 text-xs text-ember-300">
                          {line.note}
                        </p>
                      ) : null}
                    </div>
                    <p className="tnum shrink-0 text-sm text-chaff-100">
                      {formatAed(line.unitPriceFils * line.quantity)}
                    </p>
                  </div>

                  {!terminal ? (
                    <div className="mt-3 flex items-center gap-1">
                      <Button
                        size="icon-sm"
                        variant="outline"
                        aria-label={`Remove one ${line.name}`}
                        onClick={() => setQuantity(line.id, line.quantity - 1)}
                      >
                        <Minus />
                      </Button>
                      <span className="tnum w-8 text-center text-sm text-chaff-100">
                        {line.quantity}
                      </span>
                      <Button
                        size="icon-sm"
                        variant="outline"
                        aria-label={`Add one ${line.name}`}
                        onClick={() => setQuantity(line.id, line.quantity + 1)}
                      >
                        <Plus />
                      </Button>
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        className="ml-2 text-chaff-400 hover:text-danger-300"
                        aria-label={`Take ${line.name} off the ticket`}
                        onClick={() => setQuantity(line.id, 0)}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  ) : (
                    <p className="tnum mt-2 text-xs text-chaff-400">
                      {line.quantity} ordered
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </section>

          {/* Note */}
          <section>
            <div className="flex items-center justify-between gap-3">
              <p className="db-rail">Note for the bar</p>
              {noteDirty ? (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => void saveNote()}
                  disabled={updateNote.isPending}
                >
                  {updateNote.isPending ? "Saving…" : "Save note"}
                </Button>
              ) : null}
            </div>
            <Textarea
              aria-label="Note for the bar"
              rows={2}
              className="mt-3"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Extra hot. Ring the bell twice."
            />
          </section>
        </div>

        <SheetFooter className="border-t border-roast-700">
          <dl className="mb-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-chaff-400">Subtotal</dt>
              <dd className="tnum text-chaff-100">
                {formatAed(totals.subtotalFils)}
              </dd>
            </div>
            {totals.deliveryFeeFils > 0 ? (
              <div className="flex justify-between">
                <dt className="text-chaff-400">Delivery</dt>
                <dd className="tnum text-chaff-100">
                  {formatAed(totals.deliveryFeeFils)}
                </dd>
              </div>
            ) : null}
            <div className="flex justify-between">
              <dt className="text-chaff-400">VAT 5%</dt>
              <dd className="tnum text-chaff-100">
                {formatAed(totals.vatFils)}
              </dd>
            </div>
            <div className="flex justify-between border-t border-roast-700 pt-2">
              <dt className="font-display text-base text-chaff-50">Total</dt>
              <dd className="tnum text-base text-ember-400">
                AED {formatAed(totals.totalFils)}
              </dd>
            </div>
          </dl>

          {order.status !== "cancelled" ? (
            <Button
              variant="destructive"
              className="w-full"
              onClick={() => onCancel(order)}
            >
              Cancel order
            </Button>
          ) : (
            <p className="text-xs text-danger-300">
              Cancelled
              {order.cancellationReason
                ? ` — ${order.cancellationReason}`
                : "."}
            </p>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
