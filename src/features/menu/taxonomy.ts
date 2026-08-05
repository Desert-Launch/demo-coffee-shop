import { MENU_CATEGORIES, type MenuCategory, type MenuTag } from "@/types";

export interface CategoryMeta {
  label: string;
  /** Sits under the category heading on the menu page. */
  blurb: string;
  /** Prefix used when the admin form suggests a code. */
  prefix: string;
  /** Token references for the drink cross-section swatch. */
  swatchTop: string;
  swatchBottom: string;
}

export const CATEGORY_META: Record<MenuCategory, CategoryMeta> = {
  espresso: {
    label: "Espresso",
    blurb: "Pulled on the two-group. Ask for a taste before you commit.",
    prefix: "ESP",
    swatchTop: "var(--db-cat-espresso-top)",
    swatchBottom: "var(--db-cat-espresso-bottom)",
  },
  filter: {
    label: "Filter",
    blurb: "Brewed by the cup. Six origins open at any time.",
    prefix: "FIL",
    swatchTop: "var(--db-cat-filter-top)",
    swatchBottom: "var(--db-cat-filter-bottom)",
  },
  cold: {
    label: "Cold",
    blurb: "Built over clear ice, which melts slower than the cloudy kind.",
    prefix: "CLD",
    swatchTop: "var(--db-cat-cold-top)",
    swatchBottom: "var(--db-cat-cold-bottom)",
  },
  tea: {
    label: "Tea",
    blurb: "Karak on the boil all day. Everything else made to order.",
    prefix: "TEA",
    swatchTop: "var(--db-cat-tea-top)",
    swatchBottom: "var(--db-cat-tea-bottom)",
  },
  bakery: {
    label: "Bakery",
    blurb: "Laminated overnight, baked at five, out by eleven.",
    prefix: "BAK",
    swatchTop: "var(--db-cat-bakery-top)",
    swatchBottom: "var(--db-cat-bakery-bottom)",
  },
  food: {
    label: "Kitchen",
    blurb: "Served until four. Bread comes from the same oven.",
    prefix: "FOD",
    swatchTop: "var(--db-cat-food-top)",
    swatchBottom: "var(--db-cat-food-bottom)",
  },
};

export const CATEGORY_ORDER: readonly MenuCategory[] = MENU_CATEGORIES;

export const TAG_LABELS: Record<MenuTag, string> = {
  signature: "Signature",
  vegan: "Vegan",
  decaf: "Decaf",
  seasonal: "Seasonal",
  "contains-nuts": "Contains nuts",
  "high-caffeine": "High caffeine",
};

/** Inline style object for the CSS-only drink swatch. */
export function swatchStyle(category: MenuCategory): React.CSSProperties {
  const meta = CATEGORY_META[category];
  return {
    "--swatch-top": meta.swatchTop,
    "--swatch-bottom": meta.swatchBottom,
  } as React.CSSProperties;
}
