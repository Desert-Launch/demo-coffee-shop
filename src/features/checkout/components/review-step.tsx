"use client";

import { ArrowLeft, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { OrderType } from "@/types";
import { ASAP_SLOT, describeSlot } from "../slots";
import type { CheckoutDetailsValues } from "../schema";

interface ReviewStepProps {
  type: OrderType;
  details: CheckoutDetailsValues;
  slot: string;
  pending: boolean;
  error: string | null;
  onBack: () => void;
  onEditStep: (step: "fulfilment" | "details" | "time") => void;
  onPlace: () => void;
}

function Row({
  label,
  children,
  onEdit,
  editLabel,
}: {
  label: string;
  children: React.ReactNode;
  onEdit: () => void;
  editLabel: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-roast-700 py-4 last:border-b-0">
      <div className="min-w-0">
        <p className="db-rail">{label}</p>
        <div className="mt-2 text-sm text-chaff-100">{children}</div>
      </div>
      <Button variant="ghost" size="sm" onClick={onEdit}>
        {editLabel}
      </Button>
    </div>
  );
}

export function ReviewStep({
  type,
  details,
  slot,
  pending,
  error,
  onBack,
  onEditStep,
  onPlace,
}: ReviewStepProps) {
  const leadMinutes = type === "delivery" ? 25 : 10;

  return (
    <div>
      <h2 className="text-2xl text-chaff-50">Check it over</h2>
      <p className="mt-2 text-chaff-400">
        Nothing is charged in this demo. Placing the order sends it to the bar.
      </p>

      <div className="mt-7 rounded-lg border border-roast-700 bg-roast-800 px-6">
        <Row
          label="How"
          editLabel="Change"
          onEdit={() => onEditStep("fulfilment")}
        >
          {type === "delivery"
            ? "Delivery across Dubai"
            : "Pickup from 1 Demo Street, Demo District"}
        </Row>

        <Row label="Who" editLabel="Edit" onEdit={() => onEditStep("details")}>
          <p>{details.name}</p>
          <p className="tnum text-chaff-400">{details.phone}</p>
          {details.email ? (
            <p className="text-chaff-400">{details.email}</p>
          ) : null}
          {type === "delivery" ? (
            <p className="mt-2 text-chaff-400">
              {details.addressLine1}, {details.area}, Dubai
              {details.addressNotes ? ` — ${details.addressNotes}` : ""}
            </p>
          ) : null}
        </Row>

        <Row label="When" editLabel="Change" onEdit={() => onEditStep("time")}>
          {describeSlot(slot === "" ? ASAP_SLOT : slot, leadMinutes)}
        </Row>
      </div>

      {error ? (
        <p
          role="alert"
          className="mt-5 rounded-md border border-danger-500/40 bg-danger-950 px-4 py-3 text-sm text-danger-300"
        >
          {error}
        </p>
      ) : null}

      <div className="mt-8 flex flex-wrap gap-3">
        <Button
          variant="outline"
          size="lg"
          className="h-11 px-5"
          onClick={onBack}
          disabled={pending}
        >
          <ArrowLeft data-icon="inline-start" />
          Back
        </Button>
        <Button
          size="lg"
          className="h-11 px-5"
          onClick={onPlace}
          disabled={pending}
        >
          {pending ? (
            <>
              <Loader2 data-icon="inline-start" className="animate-spin" />
              Placing order…
            </>
          ) : (
            "Place order"
          )}
        </Button>
      </div>
    </div>
  );
}
