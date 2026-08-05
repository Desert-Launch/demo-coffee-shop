import { z } from "zod";

import { PHONE_PATTERN } from "@/lib/patterns";

export const CHECKOUT_STEPS = [
  "fulfilment",
  "details",
  "time",
  "review",
  "confirmation",
] as const;
export type CheckoutStep = (typeof CHECKOUT_STEPS)[number];

export const fulfilmentSchema = z.object({
  type: z.enum(["pickup", "delivery"]),
});
export type FulfilmentValues = z.infer<typeof fulfilmentSchema>;

/**
 * `type` rides along in the form so the address rules can be expressed here
 * rather than in the component.
 */
export const checkoutDetailsSchema = z
  .object({
    type: z.enum(["pickup", "delivery"]),
    name: z
      .string()
      .trim()
      .min(2, "We write this on the cup.")
      .max(48, "Keep it under 48 characters."),
    phone: z
      .string()
      .trim()
      .regex(PHONE_PATTERN, "Use a number like 050 123 4567."),
    email: z.union([
      z.literal(""),
      z.email("Check the email address — it needs an @ and a domain."),
    ]),
    addressLine1: z.string().trim().max(80, "Keep it under 80 characters."),
    area: z.string().trim().max(48, "Keep it under 48 characters."),
    addressNotes: z.string().trim().max(140, "Keep it under 140 characters."),
  })
  .superRefine((values, ctx) => {
    if (values.type !== "delivery") return;

    if (values.addressLine1.length < 4) {
      ctx.addIssue({
        code: "custom",
        path: ["addressLine1"],
        message: "Add a building and unit so the driver can find you.",
      });
    }
    if (values.area.length < 2) {
      ctx.addIssue({
        code: "custom",
        path: ["area"],
        message: "Tell us which area you are in.",
      });
    }
  });

export type CheckoutDetailsValues = z.infer<typeof checkoutDetailsSchema>;

export const CHECKOUT_DETAILS_DEFAULTS: CheckoutDetailsValues = {
  type: "pickup",
  name: "",
  phone: "",
  email: "",
  addressLine1: "",
  area: "",
  addressNotes: "",
};

export const timingSchema = z.object({
  /** "asap" or an ISO timestamp from the generated slots. */
  slot: z.string().min(1, "Pick a time."),
});
export type TimingValues = z.infer<typeof timingSchema>;
