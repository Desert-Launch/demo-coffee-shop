"use client";

import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Minus, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Field, fieldAria } from "@/components/shared/field";
import { CATEGORY_META, CATEGORY_ORDER, useMenu } from "@/features/menu";
import { computeTotals } from "@/lib/pricing";
import { formatAed } from "@/lib/utils";
import type { CartLine, MenuItem, OptionSelection, OrderType } from "@/types";
import { usePlaceOrder } from "../hooks/use-orders";
import {
  MANUAL_ORDER_DEFAULTS,
  manualOrderSchema,
  type ManualOrderValues,
  type OrderLineDraft,
} from "../schema";

/** Walk-ins get each item's default options — the barista adjusts on the ticket. */
function toCartLine(item: MenuItem, quantity: number): CartLine {
  const selections: OptionSelection[] = item.optionGroups
    .filter((group) => group.required && group.choices.length > 0)
    .map((group) => {
      const choice = group.choices[0];
      return {
        groupId: group.id,
        groupLabel: group.label,
        choiceId: choice.id,
        choiceLabel: choice.label,
        priceDeltaFils: choice.priceDeltaFils,
      };
    });

  return {
    lineId: `${item.id}-${quantity}`,
    menuItemId: item.id,
    code: item.code,
    name: item.name,
    category: item.category,
    unitPriceFils:
      item.basePriceFils +
      selections.reduce((sum, s) => sum + s.priceDeltaFils, 0),
    quantity,
    selections,
    note: "",
  };
}

export function ManualOrderDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { data: menu } = useMenu();
  const placeOrder = usePlaceOrder();

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ManualOrderValues>({
    resolver: zodResolver(manualOrderSchema),
    defaultValues: MANUAL_ORDER_DEFAULTS,
  });

  useEffect(() => {
    if (open) reset(MANUAL_ORDER_DEFAULTS);
  }, [open, reset]);

  const lines = watch("lines");
  const type = watch("type");

  const available = useMemo(
    () => (menu ?? []).filter((item) => item.available),
    [menu],
  );
  const byId = useMemo(
    () => new Map(available.map((item) => [item.id, item])),
    [available],
  );

  const cartLines = lines
    .map((draft) => {
      const item = byId.get(draft.menuItemId);
      return item ? toCartLine(item, draft.quantity) : null;
    })
    .filter((line): line is CartLine => line !== null);

  const totals = computeTotals(cartLines, type);

  function addItem(menuItemId: string) {
    const existing = lines.find((line) => line.menuItemId === menuItemId);
    const next: OrderLineDraft[] = existing
      ? lines.map((line) =>
          line.menuItemId === menuItemId
            ? { ...line, quantity: Math.min(20, line.quantity + 1) }
            : line,
        )
      : [...lines, { menuItemId, quantity: 1 }];

    setValue("lines", next, { shouldValidate: true });
  }

  function setQuantity(menuItemId: string, quantity: number) {
    const next =
      quantity <= 0
        ? lines.filter((line) => line.menuItemId !== menuItemId)
        : lines.map((line) =>
            line.menuItemId === menuItemId
              ? { ...line, quantity: Math.min(20, quantity) }
              : line,
          );
    setValue("lines", next, { shouldValidate: true });
  }

  async function onSubmit(values: ManualOrderValues) {
    try {
      const order = await placeOrder.mutateAsync({
        type: values.type,
        channel: "walk-in",
        customer: {
          name: values.customerName,
          phone: values.phone,
          email: "",
          address: null,
        },
        lines: cartLines,
        scheduledFor: null,
        staffNote: values.staffNote,
      });

      toast.success("Order added", {
        description: `${order.reference} is on the board under New.`,
      });
      onOpenChange(false);
    } catch (cause) {
      toast.error("Order not added", {
        description:
          cause instanceof Error
            ? cause.message
            : "Something went wrong. Try adding it again.",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto border-roast-700 bg-roast-850 sm:max-w-2xl">
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              Add a walk-in order
            </DialogTitle>
            <DialogDescription className="text-chaff-400">
              Goes straight onto the board under New, the same as an online one.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="Name on the cup"
                htmlFor="wo-name"
                error={errors.customerName?.message}
              >
                <Input
                  id="wo-name"
                  placeholder="Khalid"
                  {...fieldAria("wo-name", errors.customerName?.message)}
                  {...register("customerName")}
                />
              </Field>

              <Field
                label="Phone"
                htmlFor="wo-phone"
                error={errors.phone?.message}
                hint="Optional for walk-ins."
              >
                <Input
                  id="wo-phone"
                  type="tel"
                  placeholder="050 123 4567"
                  {...fieldAria(
                    "wo-phone",
                    errors.phone?.message,
                    "Optional for walk-ins.",
                  )}
                  {...register("phone")}
                />
              </Field>
            </div>

            <Field
              label="Pickup or delivery"
              htmlFor="wo-type"
              error={errors.type?.message}
            >
              <Controller
                control={control}
                name="type"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(value) => field.onChange(value as OrderType)}
                  >
                    <SelectTrigger id="wo-type" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pickup">Pickup at the bar</SelectItem>
                      <SelectItem value="delivery">Delivery</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>

            <div>
              <p className="db-rail">Items</p>
              <div className="mt-3">
                <Select value="" onValueChange={addItem}>
                  <SelectTrigger
                    className="w-full"
                    aria-label="Add an item to the order"
                  >
                    <SelectValue placeholder="Add an item…" />
                  </SelectTrigger>
                  <SelectContent className="max-h-72">
                    {CATEGORY_ORDER.map((category) => {
                      const items = available.filter(
                        (item) => item.category === category,
                      );
                      if (items.length === 0) return null;

                      return (
                        <SelectGroup key={category}>
                          <SelectLabel>
                            {CATEGORY_META[category].label}
                          </SelectLabel>
                          {items.map((item) => (
                            <SelectItem key={item.id} value={item.id}>
                              {item.name} · AED {formatAed(item.basePriceFils)}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              {cartLines.length > 0 ? (
                <ul className="mt-4 divide-y divide-roast-700 rounded-lg border border-roast-700 bg-roast-800">
                  {cartLines.map((line) => (
                    <li
                      key={line.menuItemId}
                      className="flex items-center justify-between gap-4 p-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm text-chaff-50">
                          {line.name}
                        </p>
                        {line.selections.length > 0 ? (
                          <p className="truncate text-xs text-chaff-400">
                            {line.selections
                              .map((s) => s.choiceLabel)
                              .join(" · ")}
                          </p>
                        ) : null}
                      </div>
                      <div className="flex shrink-0 items-center gap-1">
                        <Button
                          type="button"
                          size="icon-sm"
                          variant="outline"
                          aria-label={`Remove one ${line.name}`}
                          onClick={() =>
                            setQuantity(line.menuItemId, line.quantity - 1)
                          }
                        >
                          <Minus />
                        </Button>
                        <span className="tnum w-7 text-center text-sm text-chaff-100">
                          {line.quantity}
                        </span>
                        <Button
                          type="button"
                          size="icon-sm"
                          variant="outline"
                          aria-label={`Add one ${line.name}`}
                          onClick={() =>
                            setQuantity(line.menuItemId, line.quantity + 1)
                          }
                        >
                          <Plus />
                        </Button>
                        <span className="tnum ml-3 w-16 text-right text-sm text-chaff-100">
                          {formatAed(line.unitPriceFils * line.quantity)}
                        </span>
                        <Button
                          type="button"
                          size="icon-sm"
                          variant="ghost"
                          className="text-chaff-400 hover:text-danger-300"
                          aria-label={`Take ${line.name} off the order`}
                          onClick={() => setQuantity(line.menuItemId, 0)}
                        >
                          <Trash2 />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : null}

              {errors.lines ? (
                <p role="alert" className="mt-2 text-xs text-danger-300">
                  {errors.lines.message}
                </p>
              ) : null}
            </div>

            <Field
              label="Note for the bar"
              htmlFor="wo-note"
              error={errors.staffNote?.message}
            >
              <Textarea
                id="wo-note"
                rows={2}
                placeholder="Extra hot."
                {...fieldAria("wo-note", errors.staffNote?.message)}
                {...register("staffNote")}
              />
            </Field>
          </div>

          <DialogFooter className="items-center sm:justify-between">
            <p className="tnum text-sm text-ember-400">
              Total AED {formatAed(totals.totalFils)}
            </p>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={placeOrder.isPending}
              >
                Discard
              </Button>
              <Button type="submit" disabled={placeOrder.isPending}>
                {placeOrder.isPending ? (
                  <>
                    <Loader2 data-icon="inline-start" className="animate-spin" />
                    Adding…
                  </>
                ) : (
                  "Add to the board"
                )}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
