"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, fieldAria } from "@/components/shared/field";
import type { OrderType } from "@/types";
import {
  checkoutDetailsSchema,
  type CheckoutDetailsValues,
} from "../schema";

interface DetailsStepProps {
  type: OrderType;
  values: CheckoutDetailsValues;
  onBack: () => void;
  onNext: (values: CheckoutDetailsValues) => void;
}

export function DetailsStep({
  type,
  values,
  onBack,
  onNext,
}: DetailsStepProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CheckoutDetailsValues>({
    resolver: zodResolver(checkoutDetailsSchema),
    defaultValues: { ...values, type },
  });

  // Keep the hidden `type` in step with the previous step's choice, so the
  // address rules switch on and off correctly.
  useEffect(() => {
    setValue("type", type);
  }, [type, setValue]);

  return (
    <form noValidate onSubmit={handleSubmit(onNext)}>
      <h2 className="text-2xl text-chaff-50">Who is it for?</h2>
      <p className="mt-2 text-chaff-400">
        {type === "delivery"
          ? "The driver calls when they are outside, so the number matters."
          : "We write the name on the cup and call it at the pass."}
      </p>

      <input type="hidden" {...register("type")} />

      <div className="mt-7 space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Name" htmlFor="co-name" error={errors.name?.message}>
            <Input
              id="co-name"
              autoComplete="name"
              placeholder="Layla Haddad"
              {...fieldAria("co-name", errors.name?.message)}
              {...register("name")}
            />
          </Field>

          <Field label="Phone" htmlFor="co-phone" error={errors.phone?.message}>
            <Input
              id="co-phone"
              type="tel"
              autoComplete="tel"
              placeholder="050 123 4567"
              {...fieldAria("co-phone", errors.phone?.message)}
              {...register("phone")}
            />
          </Field>
        </div>

        <Field
          label="Email"
          htmlFor="co-email"
          error={errors.email?.message}
          hint="Optional. We send the receipt here if you add it."
        >
          <Input
            id="co-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.ae"
            {...fieldAria(
              "co-email",
              errors.email?.message,
              "Optional. We send the receipt here if you add it.",
            )}
            {...register("email")}
          />
        </Field>

        {type === "delivery" ? (
          <div className="space-y-5 rounded-lg border border-roast-700 bg-roast-850 p-5">
            <p className="db-rail">Where to</p>

            <Field
              label="Building and unit"
              htmlFor="co-address"
              error={errors.addressLine1?.message}
            >
              <Input
                id="co-address"
                autoComplete="address-line1"
                placeholder="Bay Square 11, office 604"
                {...fieldAria("co-address", errors.addressLine1?.message)}
                {...register("addressLine1")}
              />
            </Field>

            <Field label="Area" htmlFor="co-area" error={errors.area?.message}>
              <Input
                id="co-area"
                autoComplete="address-level2"
                placeholder="Business Bay"
                {...fieldAria("co-area", errors.area?.message)}
                {...register("area")}
              />
            </Field>

            <Field
              label="Anything the driver should know"
              htmlFor="co-notes"
              error={errors.addressNotes?.message}
            >
              <Textarea
                id="co-notes"
                rows={3}
                placeholder="Leave with the concierge."
                {...fieldAria("co-notes", errors.addressNotes?.message)}
                {...register("addressNotes")}
              />
            </Field>
          </div>
        ) : null}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="h-11 px-5"
          onClick={onBack}
        >
          <ArrowLeft data-icon="inline-start" />
          Back
        </Button>
        <Button type="submit" size="lg" className="h-11 px-5">
          Continue
          <ArrowRight data-icon="inline-end" />
        </Button>
      </div>
    </form>
  );
}
