import type { MenuCategory, MenuOptionGroup } from "@/types";

/**
 * Shared option-group shapes so "Size" or "Milk" reads identically on every
 * card. Price deltas are in fils and are added to the item's base price.
 */

export function sizeGroup(medium = 400, large = 700): MenuOptionGroup {
  return {
    id: "size",
    label: "Size",
    kind: "size",
    required: true,
    choices: [
      { id: "s", label: "Small", priceDeltaFils: 0 },
      { id: "m", label: "Medium", priceDeltaFils: medium },
      { id: "l", label: "Large", priceDeltaFils: large },
    ],
  };
}

export function milkGroup(): MenuOptionGroup {
  return {
    id: "milk",
    label: "Milk",
    kind: "milk",
    required: true,
    choices: [
      { id: "full", label: "Full fat", priceDeltaFils: 0 },
      { id: "skimmed", label: "Skimmed", priceDeltaFils: 0 },
      { id: "oat", label: "Oat", priceDeltaFils: 300 },
      { id: "almond", label: "Almond", priceDeltaFils: 300 },
    ],
  };
}

export function shotGroup(): MenuOptionGroup {
  return {
    id: "shot",
    label: "Extra shot",
    kind: "extra",
    required: false,
    choices: [
      { id: "single", label: "Single", priceDeltaFils: 500 },
      { id: "double", label: "Double", priceDeltaFils: 900 },
    ],
  };
}

export function beanGroup(): MenuOptionGroup {
  return {
    id: "bean",
    label: "Bean",
    kind: "extra",
    required: true,
    choices: [
      { id: "wadi", label: "Wadi lot 07 · washed", priceDeltaFils: 0 },
      { id: "sidama", label: "Sidama · natural", priceDeltaFils: 400 },
      { id: "colombia-decaf", label: "Colombia · decaf", priceDeltaFils: 0 },
    ],
  };
}

export function serveGroup(): MenuOptionGroup {
  return {
    id: "serve",
    label: "Serve",
    kind: "extra",
    required: true,
    choices: [
      { id: "as-is", label: "As it comes", priceDeltaFils: 0 },
      { id: "warmed", label: "Warmed", priceDeltaFils: 0 },
    ],
  };
}

export function breadGroup(): MenuOptionGroup {
  return {
    id: "bread",
    label: "Bread",
    kind: "extra",
    required: true,
    choices: [
      { id: "sourdough", label: "Sourdough", priceDeltaFils: 0 },
      { id: "seeded", label: "Seeded rye", priceDeltaFils: 200 },
      { id: "gluten-free", label: "Gluten free", priceDeltaFils: 400 },
    ],
  };
}

/** Applied to items created from the admin menu form. */
export function defaultOptionGroups(category: MenuCategory): MenuOptionGroup[] {
  switch (category) {
    case "espresso":
      return [sizeGroup(), milkGroup(), shotGroup()];
    case "filter":
      return [beanGroup()];
    case "cold":
      return [sizeGroup(), milkGroup(), shotGroup()];
    case "tea":
      return [sizeGroup(200, 400)];
    case "bakery":
      return [serveGroup()];
    case "food":
      return [breadGroup()];
  }
}
