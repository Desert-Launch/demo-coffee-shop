"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Field, fieldAria } from "@/components/shared/field";
import type { Order } from "@/types";
import { cancelOrderSchema, type CancelOrderValues } from "../schema";

interface CancelOrderDialogProps {
  order: Order | null;
  open: boolean;
  pending: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reason: string) => void;
}

export function CancelOrderDialog({
  order,
  open,
  pending,
  onOpenChange,
  onConfirm,
}: CancelOrderDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CancelOrderValues>({
    resolver: zodResolver(cancelOrderSchema),
    defaultValues: { reason: "" },
  });

  useEffect(() => {
    if (open) reset({ reason: "" });
  }, [open, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-roast-700 bg-roast-850">
        <form
          noValidate
          onSubmit={handleSubmit((values) => onConfirm(values.reason))}
        >
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              Cancel {order?.reference}?
            </DialogTitle>
            <DialogDescription className="text-chaff-400">
              The ticket moves to cancelled and the card is refunded. The
              customer sees the reason you write here.
            </DialogDescription>
          </DialogHeader>

          <div className="py-5">
            <Field
              label="Reason"
              htmlFor="cancel-reason"
              error={errors.reason?.message}
            >
              <Textarea
                id="cancel-reason"
                rows={3}
                placeholder="Kitchen ran out of sourdough."
                {...fieldAria("cancel-reason", errors.reason?.message)}
                {...register("reason")}
              />
            </Field>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={pending}
            >
              Keep the order
            </Button>
            <Button
              type="submit"
              disabled={pending}
              className="bg-danger-500 text-chaff-50 hover:bg-danger-500/80"
            >
              {pending ? (
                <>
                  <Loader2 data-icon="inline-start" className="animate-spin" />
                  Cancelling…
                </>
              ) : (
                "Cancel order"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
