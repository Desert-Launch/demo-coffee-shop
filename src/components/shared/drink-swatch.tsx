import { swatchStyle } from "@/features/menu";
import type { MenuCategory } from "@/types";
import { cn } from "@/lib/utils";

/**
 * Stands in for a photo. A side-on cross-section of the drink built from two
 * category tokens — foam or crema on top, liquid below. No image assets.
 */
export function DrinkSwatch({
  category,
  className,
}: {
  category: MenuCategory;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      style={swatchStyle(category)}
      className={cn(
        "db-swatch shrink-0 rounded-t-[3px] rounded-b-[12px]",
        className,
      )}
    />
  );
}
