"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { Field, fieldAria } from "@/components/shared/field";
import { sendMessage } from "../api";
import {
  CONTACT_DEFAULTS,
  CONTACT_TOPIC_LABELS,
  CONTACT_TOPICS,
  contactSchema,
  type ContactValues,
} from "../schema";

export function ContactForm() {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: CONTACT_DEFAULTS,
  });

  async function onSubmit(values: ContactValues) {
    await sendMessage(values);
    toast.success("Message sent", {
      description: `We reply from the bar, usually within a day. Thanks, ${values.name.split(" ")[0]}.`,
    });
    reset(CONTACT_DEFAULTS);
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5 rounded-lg border border-roast-700 bg-roast-800 p-7"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name" htmlFor="contact-name" error={errors.name?.message}>
          <Input
            id="contact-name"
            autoComplete="name"
            placeholder="Your name"
            {...fieldAria("contact-name", errors.name?.message)}
            {...register("name")}
          />
        </Field>

        <Field label="Email" htmlFor="contact-email" error={errors.email?.message}>
          <Input
            id="contact-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.ae"
            {...fieldAria("contact-email", errors.email?.message)}
            {...register("email")}
          />
        </Field>
      </div>

      <Field label="What is it about" htmlFor="contact-topic" error={errors.topic?.message}>
        <Controller
          control={control}
          name="topic"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger
                id="contact-topic"
                className="w-full"
                {...fieldAria("contact-topic", errors.topic?.message)}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CONTACT_TOPICS.map((topic) => (
                  <SelectItem key={topic} value={topic}>
                    {CONTACT_TOPIC_LABELS[topic]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </Field>

      <Field
        label="Message"
        htmlFor="contact-message"
        error={errors.message?.message}
        hint="The bar reads these between rushes, so a day is normal."
      >
        <Textarea
          id="contact-message"
          rows={6}
          placeholder="What can we help with?"
          {...fieldAria(
            "contact-message",
            errors.message?.message,
            "The bar reads these between rushes, so a day is normal.",
          )}
          {...register("message")}
        />
      </Field>

      <Button type="submit" size="lg" disabled={isSubmitting} className="h-11 px-5">
        <Send data-icon="inline-start" />
        {isSubmitting ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
