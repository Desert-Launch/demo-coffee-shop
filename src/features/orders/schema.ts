import { z } from "zod";

import { PHONE_PATTERN } from "@/lib/patterns";

export const orderLineDraftSchema = z.object({
  menuItemId: z.string().min(1),
  quantity: z.number().int().min(1).max(20),
});

export type OrderLineDraft = z.infer<typeof orderLineDraftSchema>;

/** The walk-in order a barista types in at the till. */
export const manualOrderSchema = z.object({
  customerName: z
    .string()
    .trim()
    .min(2, "Who is this order for?")
    .max(48, "Keep the name under 48 characters."),
  phone: z
    .string()
    .trim()
    .refine(
      (value) => value === "" || PHONE_PATTERN.test(value),
      "Use a number like 050 123 4567, or leave it blank.",
    ),
  type: z.enum(["pickup", "delivery"]),
  staffNote: z.string().trim().max(140, "Keep the note under 140 characters."),
  lines: z
    .array(orderLineDraftSchema)
    .min(1, "Add at least one item before you send it to the bar."),
});

export type ManualOrderValues = z.infer<typeof manualOrderSchema>;

export const MANUAL_ORDER_DEFAULTS: ManualOrderValues = {
  customerName: "",
  phone: "",
  type: "pickup",
  staffNote: "",
  lines: [],
};

export const cancelOrderSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(4, "Say what happened, so the customer can be told.")
    .max(120, "Keep the reason under 120 characters."),
});

export type CancelOrderValues = z.infer<typeof cancelOrderSchema>;

export const staffNoteSchema = z.object({
  staffNote: z.string().trim().max(140, "Keep the note under 140 characters."),
});

export type StaffNoteValues = z.infer<typeof staffNoteSchema>;
