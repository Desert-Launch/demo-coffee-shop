import { z } from "zod";

import { MENU_CATEGORIES, MENU_TAGS } from "@/types";

/**
 * The admin menu form. Prices are entered in AED and converted to fils by
 * `toMenuItemInput` — the store only ever sees integers.
 */
export const menuItemFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Give the item a name.")
    .max(48, "Keep the name under 48 characters."),
  code: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z]{3}-\d{2}$/, "Codes look like ESP-04."),
  description: z
    .string()
    .trim()
    .min(10, "Write at least one line so the card is not empty.")
    .max(140, "Keep the description under 140 characters."),
  category: z.enum(MENU_CATEGORIES),
  priceAed: z
    .number({ error: "Enter a price in AED." })
    .min(1, "The lowest price on the bar is AED 1.")
    .max(500, "That is higher than anything we sell."),
  intensity: z
    .number({ error: "Pick a strength from 0 to 5." })
    .int()
    .min(0)
    .max(5),
  tags: z.array(z.enum(MENU_TAGS)),
  available: z.boolean(),
  isSignature: z.boolean(),
});

export type MenuItemFormValues = z.infer<typeof menuItemFormSchema>;

export const MENU_ITEM_FORM_DEFAULTS: MenuItemFormValues = {
  name: "",
  code: "",
  description: "",
  category: "espresso",
  priceAed: 20,
  intensity: 3,
  tags: [],
  available: true,
  isSignature: false,
};
