"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Field, fieldAria } from "@/components/shared/field";
import { MENU_TAGS, type MenuCategory, type MenuItem } from "@/types";
import { toMenuItemFormValues, toMenuItemInput } from "../api";
import { useCreateMenuItem, useUpdateMenuItem } from "../hooks/use-menu";
import {
  MENU_ITEM_FORM_DEFAULTS,
  menuItemFormSchema,
  type MenuItemFormValues,
} from "../schema";
import { CATEGORY_META, CATEGORY_ORDER, TAG_LABELS } from "../taxonomy";

interface MenuItemFormDialogProps {
  /** null means "create a new item". */
  item: MenuItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MenuItemFormDialog({
  item,
  open,
  onOpenChange,
}: MenuItemFormDialogProps) {
  const create = useCreateMenuItem();
  const update = useUpdateMenuItem();
  const editing = item !== null;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<MenuItemFormValues>({
    resolver: zodResolver(menuItemFormSchema),
    defaultValues: MENU_ITEM_FORM_DEFAULTS,
  });

  useEffect(() => {
    if (!open) return;
    reset(item ? toMenuItemFormValues(item) : MENU_ITEM_FORM_DEFAULTS);
  }, [open, item, reset]);

  async function onSubmit(values: MenuItemFormValues) {
    const input = toMenuItemInput(values);

    try {
      if (item) {
        await update.mutateAsync({ id: item.id, input });
        toast.success("Item saved", {
          description: `${input.name} is updated on the public menu.`,
        });
      } else {
        await create.mutateAsync(input);
        toast.success("Item added", {
          description: `${input.name} is live on the ${CATEGORY_META[input.category].label.toLowerCase()} menu.`,
        });
      }
      onOpenChange(false);
    } catch (cause) {
      toast.error(item ? "Item not saved" : "Item not added", {
        description:
          cause instanceof Error ? cause.message : "Try saving it again.",
      });
    }
  }

  const pending = create.isPending || update.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto border-roast-700 bg-roast-850 sm:max-w-2xl">
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              {editing ? `Edit ${item.name}` : "Add a menu item"}
            </DialogTitle>
            <DialogDescription className="text-chaff-400">
              Changes show on the public menu straight away. Size and milk
              options come from the category.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-5">
            <div className="grid gap-5 sm:grid-cols-[1fr_10rem]">
              <Field label="Name" htmlFor="mi-name" error={errors.name?.message}>
                <Input
                  id="mi-name"
                  placeholder="Iced Spanish latte"
                  {...fieldAria("mi-name", errors.name?.message)}
                  {...register("name")}
                />
              </Field>

              <Field
                label="Code"
                htmlFor="mi-code"
                error={errors.code?.message}
                hint="Three letters, dash, two digits."
              >
                <Input
                  id="mi-code"
                  placeholder="CLD-07"
                  className="tnum uppercase"
                  {...fieldAria(
                    "mi-code",
                    errors.code?.message,
                    "Three letters, dash, two digits.",
                  )}
                  {...register("code")}
                />
              </Field>
            </div>

            <Field
              label="Description"
              htmlFor="mi-description"
              error={errors.description?.message}
              hint="One line. It is the only copy on the card."
            >
              <Textarea
                id="mi-description"
                rows={2}
                placeholder="Condensed milk stirred through, less sweet than most."
                {...fieldAria(
                  "mi-description",
                  errors.description?.message,
                  "One line. It is the only copy on the card.",
                )}
                {...register("description")}
              />
            </Field>

            <div className="grid gap-5 sm:grid-cols-3">
              <Field
                label="Category"
                htmlFor="mi-category"
                error={errors.category?.message}
              >
                <Controller
                  control={control}
                  name="category"
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={(value) =>
                        field.onChange(value as MenuCategory)
                      }
                    >
                      <SelectTrigger id="mi-category" className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORY_ORDER.map((category) => (
                          <SelectItem key={category} value={category}>
                            {CATEGORY_META[category].label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>

              <Field
                label="Price, AED"
                htmlFor="mi-price"
                error={errors.priceAed?.message}
              >
                <Input
                  id="mi-price"
                  type="number"
                  inputMode="decimal"
                  step="0.5"
                  min="1"
                  className="tnum"
                  {...fieldAria("mi-price", errors.priceAed?.message)}
                  {...register("priceAed", { valueAsNumber: true })}
                />
              </Field>

              <Field
                label="Strength, 0–5"
                htmlFor="mi-intensity"
                error={errors.intensity?.message}
              >
                <Input
                  id="mi-intensity"
                  type="number"
                  inputMode="numeric"
                  step="1"
                  min="0"
                  max="5"
                  className="tnum"
                  {...fieldAria("mi-intensity", errors.intensity?.message)}
                  {...register("intensity", { valueAsNumber: true })}
                />
              </Field>
            </div>

            <fieldset>
              <legend className="db-rail">Tags</legend>
              <Controller
                control={control}
                name="tags"
                render={({ field }) => (
                  <div className="mt-3 flex flex-wrap gap-x-6 gap-y-3">
                    {MENU_TAGS.map((tag) => {
                      const id = `mi-tag-${tag}`;
                      const checked = field.value.includes(tag);

                      return (
                        <div key={tag} className="flex items-center gap-2">
                          <Checkbox
                            id={id}
                            checked={checked}
                            onCheckedChange={(next) =>
                              field.onChange(
                                next === true
                                  ? [...field.value, tag]
                                  : field.value.filter((t) => t !== tag),
                              )
                            }
                          />
                          <Label htmlFor={id} className="text-sm font-normal">
                            {TAG_LABELS[tag]}
                          </Label>
                        </div>
                      );
                    })}
                  </div>
                )}
              />
            </fieldset>

            <div className="grid gap-4 rounded-lg border border-roast-700 bg-roast-800 p-5 sm:grid-cols-2">
              <Controller
                control={control}
                name="available"
                render={({ field }) => (
                  <div className="flex items-start gap-3">
                    <Switch
                      id="mi-available"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <div>
                      <Label htmlFor="mi-available" className="text-sm">
                        On the menu
                      </Label>
                      <p className="mt-1 text-xs text-chaff-400">
                        Turn this off and it shows as sold out.
                      </p>
                    </div>
                  </div>
                )}
              />

              <Controller
                control={control}
                name="isSignature"
                render={({ field }) => (
                  <div className="flex items-start gap-3">
                    <Switch
                      id="mi-signature"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <div>
                      <Label htmlFor="mi-signature" className="text-sm">
                        Signature
                      </Label>
                      <p className="mt-1 text-xs text-chaff-400">
                        Signature drinks appear on the home page.
                      </p>
                    </div>
                  </div>
                )}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={pending}
            >
              Discard
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? (
                <>
                  <Loader2 data-icon="inline-start" className="animate-spin" />
                  Saving…
                </>
              ) : editing ? (
                "Save item"
              ) : (
                "Add item"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
