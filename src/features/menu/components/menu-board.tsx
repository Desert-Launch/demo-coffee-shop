"use client";

import { useMemo } from "react";
import { TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { SectionHead } from "@/components/layout/section-head";
import type { MenuCategory, MenuItem } from "@/types";
import { pluralize } from "@/lib/utils";
import { useMenu } from "../hooks/use-menu";
import { CATEGORY_META, CATEGORY_ORDER } from "../taxonomy";
import { MenuCardSkeleton } from "./menu-card-skeleton";
import { MenuItemCard } from "./menu-item-card";

function groupByCategory(items: MenuItem[]): Map<MenuCategory, MenuItem[]> {
  const grouped = new Map<MenuCategory, MenuItem[]>();
  for (const category of CATEGORY_ORDER) {
    const inCategory = items.filter((item) => item.category === category);
    if (inCategory.length > 0) grouped.set(category, inCategory);
  }
  return grouped;
}

export function MenuBoard() {
  const { data, isPending, isError, error, refetch } = useMenu();

  const grouped = useMemo(() => groupByCategory(data ?? []), [data]);

  if (isPending) {
    return (
      <div className="space-y-16">
        {CATEGORY_ORDER.slice(0, 2).map((category) => (
          <section key={category}>
            <SectionHead
              rail={`${CATEGORY_META[category].prefix} · loading`}
              title={CATEGORY_META[category].label}
            />
            <div className="mt-8 grid gap-5 lg:grid-cols-2">
              <MenuCardSkeleton />
              <MenuCardSkeleton />
            </div>
          </section>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <EmptyState
        icon={<TriangleAlert className="size-6" />}
        title="The menu did not load"
        description={error.message}
        action={
          <Button onClick={() => void refetch()} size="lg">
            Try again
          </Button>
        }
      />
    );
  }

  if (grouped.size === 0) {
    return (
      <EmptyState
        title="Nothing on the menu right now"
        description="The bar is between menus. Check back in a few minutes."
      />
    );
  }

  return (
    <div className="space-y-20">
      {[...grouped].map(([category, items]) => {
        const meta = CATEGORY_META[category];
        const sold = items.filter((item) => !item.available).length;

        return (
          <section
            key={category}
            id={category}
            aria-labelledby={`${category}-heading`}
            className="scroll-mt-32"
          >
            <SectionHead
              id={`${category}-heading`}
              rail={`${meta.prefix} · ${items.length} ${pluralize(items.length, "item", "items")}${
                sold > 0 ? ` · ${sold} sold out` : ""
              }`}
              title={meta.label}
              description={meta.blurb}
            />
            <div className="mt-8 grid gap-5 lg:grid-cols-2">
              {items.map((item) => (
                <MenuItemCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
