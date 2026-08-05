"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Coffee } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { useCartActions, useCartLines } from "@/features/cart";
import { usePlaceOrder } from "@/features/orders";
import type { Order, OrderType } from "@/types";
import {
  CHECKOUT_DETAILS_DEFAULTS,
  type CheckoutDetailsValues,
  type CheckoutStep,
} from "../schema";
import { ASAP_SLOT } from "../slots";
import { ConfirmationStep } from "./confirmation-step";
import { DetailsStep } from "./details-step";
import { FulfilmentStep } from "./fulfilment-step";
import { OrderSummary } from "./order-summary";
import { ReviewStep } from "./review-step";
import { StepRail } from "./step-rail";
import { TimeStep } from "./time-step";

export function CheckoutWizard() {
  const reduceMotion = useReducedMotion();
  const lines = useCartLines();
  const { clear } = useCartActions();
  const placeOrder = usePlaceOrder();

  const [step, setStep] = useState<CheckoutStep>("fulfilment");
  const [type, setType] = useState<OrderType>("pickup");
  const [details, setDetails] = useState<CheckoutDetailsValues>(
    CHECKOUT_DETAILS_DEFAULTS,
  );
  const [slot, setSlot] = useState<string>(ASAP_SLOT);
  const [placed, setPlaced] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fixed at mount so the slot list does not shuffle as the user fills the form.
  const now = useMemo(() => new Date(), []);

  async function handlePlace() {
    setError(null);
    try {
      const order = await placeOrder.mutateAsync({
        type,
        channel: "online",
        customer: {
          name: details.name,
          phone: details.phone,
          email: details.email,
          address:
            type === "delivery"
              ? {
                  line1: details.addressLine1,
                  area: details.area,
                  city: "Dubai",
                  notes: details.addressNotes,
                }
              : null,
        },
        lines,
        scheduledFor: slot === ASAP_SLOT ? null : slot,
      });

      setPlaced(order);
      clear();
      setStep("confirmation");
      toast.success("Order placed", {
        description: `${order.reference} is on the bar board.`,
      });
    } catch (cause) {
      const message =
        cause instanceof Error
          ? cause.message
          : "The order did not go through. Try placing it again.";
      setError(message);
      toast.error("Order not placed", { description: message });
    }
  }

  if (step === "confirmation" && placed) {
    return <ConfirmationStep order={placed} />;
  }

  if (lines.length === 0) {
    return (
      <EmptyState
        icon={<Coffee className="size-6" />}
        title="There is nothing to check out"
        description="Add a drink or a plate and the order will show up here."
        action={
          <Button asChild size="lg" className="h-11 px-5">
            <Link href="/menu">See the menu</Link>
          </Button>
        }
      />
    );
  }

  const transition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.28, ease: [0.2, 0.8, 0.2, 1] as const };

  return (
    <div className="grid gap-10 lg:grid-cols-[1.35fr_0.65fr] lg:gap-14">
      <div>
        <StepRail current={step} />

        <div className="mt-9">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={step}
              initial={reduceMotion ? false : { opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduceMotion ? { opacity: 1 } : { opacity: 0, x: -24 }}
              transition={transition}
            >
              {step === "fulfilment" ? (
                <FulfilmentStep
                  value={type}
                  onChange={setType}
                  onNext={() => setStep("details")}
                />
              ) : null}

              {step === "details" ? (
                <DetailsStep
                  type={type}
                  values={details}
                  onBack={() => setStep("fulfilment")}
                  onNext={(values) => {
                    setDetails(values);
                    setStep("time");
                  }}
                />
              ) : null}

              {step === "time" ? (
                <TimeStep
                  value={slot}
                  type={type}
                  now={now}
                  onChange={setSlot}
                  onBack={() => setStep("details")}
                  onNext={() => setStep("review")}
                />
              ) : null}

              {step === "review" ? (
                <ReviewStep
                  type={type}
                  details={details}
                  slot={slot}
                  pending={placeOrder.isPending}
                  error={error}
                  onBack={() => setStep("time")}
                  onEditStep={setStep}
                  onPlace={() => void handlePlace()}
                />
              ) : null}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <OrderSummary lines={lines} type={type} />
    </div>
  );
}
