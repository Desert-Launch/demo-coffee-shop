"use client";

import Link from "next/link";
import { ArrowRight, Coffee } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { EmptyState } from "@/components/shared/empty-state";
import { formatAed } from "@/lib/utils";
import { useCartActions, useCartLines, useCartPanel, useCartTotals } from "../hooks/use-cart";
import { CartLineRow } from "./cart-line-row";

export function CartSheet() {
  const { isOpen, setOpen } = useCartPanel();
  const lines = useCartLines();
  const { setQuantity, removeLine } = useCartActions();
  // The cart is priced as pickup; the delivery fee is added once the customer
  // chooses delivery in checkout.
  const totals = useCartTotals("pickup");

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent
        side="right"
        className="flex w-full flex-col border-roast-700 bg-roast-900 sm:max-w-md"
      >
        <SheetHeader className="border-b border-roast-700">
          <SheetTitle className="font-display text-xl">Your order</SheetTitle>
          <SheetDescription className="text-chaff-400">
            Ground and poured when you arrive.
          </SheetDescription>
        </SheetHeader>

        {lines.length === 0 ? (
          <div className="flex flex-1 items-center px-4">
            <EmptyState
              className="w-full"
              icon={<Coffee className="size-6" />}
              title="Nothing in your order yet"
              description="The espresso bar is a good place to start. Everything is ground to order."
              action={
                <Button asChild onClick={() => setOpen(false)} size="lg">
                  <Link href="/menu">
                    See the menu
                    <ArrowRight data-icon="inline-end" />
                  </Link>
                </Button>
              }
            />
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-4">
              <ul>
                {lines.map((line) => (
                  <CartLineRow
                    key={line.lineId}
                    line={line}
                    onQuantityChange={setQuantity}
                    onRemove={removeLine}
                  />
                ))}
              </ul>
            </div>

            <SheetFooter className="border-t border-roast-700">
              <dl className="mb-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-chaff-400">Subtotal</dt>
                  <dd className="tnum text-chaff-100">
                    {formatAed(totals.subtotalFils)}
                  </dd>
                </div>
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
              <p className="mb-4 text-xs text-chaff-400">
                Choosing delivery at checkout adds AED 12.00.
              </p>
              <Button asChild size="lg" className="w-full">
                <Link href="/checkout" onClick={() => setOpen(false)}>
                  Go to checkout
                  <ArrowRight data-icon="inline-end" />
                </Link>
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
