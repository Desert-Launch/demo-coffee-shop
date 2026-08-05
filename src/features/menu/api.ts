import type { MenuCategory, MenuItem, MenuTag } from "@/types";
import {
  defaultOptionGroups,
  insertMenuItem,
  newId,
  patchMenuItem,
  removeMenuItem,
  selectMenu,
  selectMenuItem,
} from "@/lib/store";
import { sleep } from "@/lib/utils";
import type { MenuItemFormValues } from "./schema";

/** Fake network time so loading and skeleton states are demoable. */
const LATENCY_MS = 120;

export interface MenuItemInput {
  name: string;
  code: string;
  description: string;
  category: MenuCategory;
  basePriceFils: number;
  intensity: number;
  tags: MenuTag[];
  available: boolean;
  isSignature: boolean;
}

export function toMenuItemInput(values: MenuItemFormValues): MenuItemInput {
  return {
    name: values.name,
    code: values.code,
    description: values.description,
    category: values.category,
    basePriceFils: Math.round(values.priceAed * 100),
    intensity: values.intensity,
    tags: values.tags,
    available: values.available,
    isSignature: values.isSignature,
  };
}

export function toMenuItemFormValues(item: MenuItem): MenuItemFormValues {
  return {
    name: item.name,
    code: item.code,
    description: item.description,
    category: item.category,
    priceAed: item.basePriceFils / 100,
    intensity: item.intensity,
    tags: item.tags,
    available: item.available,
    isSignature: item.isSignature,
  };
}

export async function fetchMenu(): Promise<MenuItem[]> {
  await sleep(LATENCY_MS);
  return selectMenu();
}

export async function fetchMenuItem(id: string): Promise<MenuItem> {
  await sleep(LATENCY_MS);
  const item = selectMenuItem(id);
  if (!item) throw new Error("That item is no longer on the menu.");
  return item;
}

export async function createMenuItem(input: MenuItemInput): Promise<MenuItem> {
  await sleep(LATENCY_MS);
  return insertMenuItem({
    ...input,
    id: newId(),
    optionGroups: defaultOptionGroups(input.category),
    createdAt: new Date().toISOString(),
  });
}

export async function updateMenuItem(
  id: string,
  input: MenuItemInput,
): Promise<MenuItem> {
  await sleep(LATENCY_MS);
  const current = selectMenuItem(id);
  if (!current) throw new Error("That item is no longer on the menu.");

  // Moving an item to another category gives it that category's options.
  const optionGroups =
    current.category === input.category
      ? current.optionGroups
      : defaultOptionGroups(input.category);

  return patchMenuItem(id, { ...input, optionGroups });
}

export async function deleteMenuItem(id: string): Promise<void> {
  await sleep(LATENCY_MS);
  removeMenuItem(id);
}

export async function setMenuItemAvailability(
  id: string,
  available: boolean,
): Promise<MenuItem> {
  await sleep(LATENCY_MS);
  return patchMenuItem(id, { available });
}
