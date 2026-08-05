/**
 * Cross-feature domain types.
 *
 * Money is stored as an integer number of fils (1 AED = 100 fils) everywhere in
 * the app. Formatting to "AED 24.00" happens only at the edge, in `formatAed`.
 */

export const MENU_CATEGORIES = [
  "espresso",
  "filter",
  "cold",
  "tea",
  "bakery",
  "food",
] as const;
export type MenuCategory = (typeof MENU_CATEGORIES)[number];

export const MENU_TAGS = [
  "signature",
  "vegan",
  "decaf",
  "seasonal",
  "contains-nuts",
  "high-caffeine",
] as const;
export type MenuTag = (typeof MENU_TAGS)[number];

export type OptionGroupKind = "size" | "milk" | "extra";

export interface MenuOptionChoice {
  id: string;
  label: string;
  /** Added to the item's base price when this choice is selected. */
  priceDeltaFils: number;
}

export interface MenuOptionGroup {
  id: string;
  label: string;
  kind: OptionGroupKind;
  /** Required groups preselect their first choice and cannot be cleared. */
  required: boolean;
  choices: MenuOptionChoice[];
}

export interface MenuItem {
  id: string;
  /** Label code printed on the bag and the ticket, e.g. "ESP-04". */
  code: string;
  name: string;
  description: string;
  category: MenuCategory;
  basePriceFils: number;
  /** 0–5, drawn as the tick scale on the menu card. */
  intensity: number;
  tags: MenuTag[];
  optionGroups: MenuOptionGroup[];
  available: boolean;
  isSignature: boolean;
  createdAt: string;
}

/** One chosen option, denormalised so a placed order never depends on the menu. */
export interface OptionSelection {
  groupId: string;
  groupLabel: string;
  choiceId: string;
  choiceLabel: string;
  priceDeltaFils: number;
}

/** A line in the client-side cart. Lives in Zustand, never in the store. */
export interface CartLine {
  lineId: string;
  menuItemId: string;
  code: string;
  name: string;
  category: MenuCategory;
  /** Base price plus every selected option delta. */
  unitPriceFils: number;
  quantity: number;
  selections: OptionSelection[];
  note: string;
}

export const ORDER_STATUSES = [
  "new",
  "preparing",
  "ready",
  "completed",
  "cancelled",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

/** Statuses shown as columns on the board, in service order. */
export const ORDER_BOARD_STATUSES = [
  "new",
  "preparing",
  "ready",
  "completed",
  "cancelled",
] as const satisfies readonly OrderStatus[];

export type OrderType = "pickup" | "delivery";
export type OrderChannel = "online" | "walk-in";

export interface OrderLine {
  id: string;
  menuItemId: string;
  code: string;
  name: string;
  category: MenuCategory;
  quantity: number;
  unitPriceFils: number;
  selections: OptionSelection[];
  note: string;
}

export interface DeliveryAddress {
  line1: string;
  area: string;
  city: string;
  notes: string;
}

export interface OrderCustomer {
  name: string;
  phone: string;
  email: string;
  address: DeliveryAddress | null;
}

export interface Order {
  id: string;
  /** Human reference on the ticket and the confirmation screen, e.g. "DB-4821". */
  reference: string;
  type: OrderType;
  channel: OrderChannel;
  status: OrderStatus;
  lines: OrderLine[];
  customer: OrderCustomer;
  subtotalFils: number;
  vatFils: number;
  deliveryFeeFils: number;
  totalFils: number;
  placedAt: string;
  /** null means "as soon as possible". */
  scheduledFor: string | null;
  readyAt: string | null;
  completedAt: string | null;
  cancelledAt: string | null;
  cancellationReason: string;
  staffNote: string;
}

export interface OrderTotals {
  subtotalFils: number;
  vatFils: number;
  deliveryFeeFils: number;
  totalFils: number;
}

/** The demo's fake staff identity, held in Zustand. */
export interface StaffMember {
  id: string;
  name: string;
  role: string;
  initials: string;
}

export const VAT_RATE = 0.05;
export const DELIVERY_FEE_FILS = 1200;
