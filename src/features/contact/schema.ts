import { z } from "zod";

export const CONTACT_TOPICS = [
  "wholesale",
  "events",
  "visit",
  "feedback",
] as const;
export type ContactTopic = (typeof CONTACT_TOPICS)[number];

export const CONTACT_TOPIC_LABELS: Record<ContactTopic, string> = {
  wholesale: "Buying beans for a business",
  events: "Booking the space",
  visit: "Visiting or a roastery tour",
  feedback: "Something about a recent order",
};

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Tell us who you are.").max(48),
  email: z.email("Check the email address — it needs an @ and a domain."),
  topic: z.enum(CONTACT_TOPICS),
  message: z
    .string()
    .trim()
    .min(20, "Give us a bit more to go on — twenty characters at least.")
    .max(800, "Keep it under 800 characters."),
});

export type ContactValues = z.infer<typeof contactSchema>;

export const CONTACT_DEFAULTS: ContactValues = {
  name: "",
  email: "",
  topic: "visit",
  message: "",
};
