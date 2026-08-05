"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Pencil, Plus, Search, Trash2, TriangleAlert } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { IntensityScale } from "@/components/shared/intensity-scale";
import { formatAed } from "@/lib/utils";
import { MENU_CATEGORIES, type MenuCategory, type MenuItem } from "@/types";
import {
  useDeleteMenuItem,
  useMenu,
  useSetMenuItemAvailability,
} from "../hooks/use-menu";
import { CATEGORY_META } from "../taxonomy";
import { MenuItemFormDialog } from "./menu-item-form-dialog";

type CategoryFilter = MenuCategory | "all";

export function AdminMenuTable() {
  const { data, isPending, isError, error, refetch } = useMenu();
  const setAvailability = useSetMenuItemAvailability();
  const remove = useDeleteMenuItem();
  const reduceMotion = useReducedMotion();

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleting, setDeleting] = useState<MenuItem | null>(null);

  const items = useMemo(() => {
    const term = query.trim().toLowerCase();
    return (data ?? [])
      .filter((item) => category === "all" || item.category === category)
      .filter(
        (item) =>
          term === "" ||
          item.name.toLowerCase().includes(term) ||
          item.code.toLowerCase().includes(term),
      );
  }, [data, query, category]);

  const soldOut = (data ?? []).filter((item) => !item.available).length;

  async function toggleAvailability(item: MenuItem, available: boolean) {
    try {
      await setAvailability.mutateAsync({ id: item.id, available });
      toast.success(
        available
          ? `${item.name} is back on the menu`
          : `${item.name} is marked sold out`,
      );
    } catch (cause) {
      toast.error("Availability not changed", {
        description:
          cause instanceof Error ? cause.message : "Try the switch again.",
      });
    }
  }

  async function confirmDelete() {
    if (!deleting) return;
    const item = deleting;

    try {
      await remove.mutateAsync(item.id);
      setDeleting(null);
      toast.success(`${item.name} removed`, {
        description: "It is off the public menu.",
      });
    } catch (cause) {
      toast.error("Item not removed", {
        description:
          cause instanceof Error ? cause.message : "Try removing it again.",
      });
    }
  }

  if (isError) {
    return (
      <EmptyState
        icon={<TriangleAlert className="size-6" />}
        title="The menu did not load"
        description={error.message}
        action={<Button onClick={() => void refetch()}>Try again</Button>}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-chaff-400">
          {isPending
            ? "Loading the menu…"
            : `${data?.length ?? 0} items · ${soldOut} sold out`}
        </p>
        <Button
          size="lg"
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
        >
          <Plus data-icon="inline-start" />
          Add an item
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative min-w-56 flex-1">
          <Search
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-chaff-600"
          />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name or code"
            aria-label="Search the menu"
            className="pl-9"
          />
        </div>

        <Select
          value={category}
          onValueChange={(value) => setCategory(value as CategoryFilter)}
        >
          <SelectTrigger className="w-48" aria-label="Filter by category">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Every category</SelectItem>
            {MENU_CATEGORIES.map((option) => (
              <SelectItem key={option} value={option}>
                {CATEGORY_META[option].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isPending ? (
        <div className="space-y-2">
          {Array.from({ length: 8 }, (_, index) => (
            <Skeleton key={index} className="h-14 rounded-md" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          title="Nothing matches that"
          description="Clear the search or pick another category to see the rest of the menu."
          action={
            <Button
              variant="outline"
              onClick={() => {
                setQuery("");
                setCategory("all");
              }}
            >
              Clear the filters
            </Button>
          }
        />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-roast-700">
          <Table className="min-w-[54rem]">
            <TableHeader>
              <TableRow className="bg-roast-850 hover:bg-roast-850">
                <TableHead className="db-rail">Code</TableHead>
                <TableHead className="db-rail">Item</TableHead>
                <TableHead className="db-rail">Category</TableHead>
                <TableHead className="db-rail text-right">Price</TableHead>
                <TableHead className="db-rail">Strength</TableHead>
                <TableHead className="db-rail">On the menu</TableHead>
                <TableHead className="db-rail text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <motion.tr
                    key={item.id}
                    layout={!reduceMotion}
                    initial={reduceMotion ? false : { opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 6 }}
                    transition={{ duration: 0.18 }}
                    className="border-b border-roast-700 bg-roast-800 last:border-b-0"
                  >
                    <TableCell className="tnum text-chaff-400">
                      {item.code}
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-chaff-50">{item.name}</p>
                      <p className="max-w-sm truncate text-xs text-chaff-400">
                        {item.description}
                      </p>
                    </TableCell>
                    <TableCell className="text-sm text-chaff-300">
                      {CATEGORY_META[item.category].label}
                    </TableCell>
                    <TableCell className="tnum text-right text-sm text-chaff-100">
                      {formatAed(item.basePriceFils)}
                    </TableCell>
                    <TableCell>
                      {item.intensity > 0 ? (
                        <IntensityScale value={item.intensity} />
                      ) : (
                        <span className="text-xs text-chaff-400">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={item.available}
                        aria-label={`${item.name} on the menu`}
                        onCheckedChange={(next) =>
                          void toggleAvailability(item, next)
                        }
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          aria-label={`Edit ${item.name}`}
                          onClick={() => {
                            setEditing(item);
                            setFormOpen(true);
                          }}
                        >
                          <Pencil />
                        </Button>
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          className="text-chaff-400 hover:text-danger-300"
                          aria-label={`Remove ${item.name}`}
                          onClick={() => setDeleting(item)}
                        >
                          <Trash2 />
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
        </div>
      )}

      <MenuItemFormDialog
        item={editing}
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditing(null);
        }}
      />

      <ConfirmDialog
        open={deleting !== null}
        onOpenChange={(open) => {
          if (!open) setDeleting(null);
        }}
        title={`Remove ${deleting?.name ?? "this item"}?`}
        description="It comes off the public menu straight away. Orders already placed keep their items."
        confirmLabel="Remove item"
        cancelLabel="Keep it"
        pending={remove.isPending}
        onConfirm={() => void confirmDelete()}
      />
    </div>
  );
}
