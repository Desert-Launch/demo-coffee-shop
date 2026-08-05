import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { differenceInMinutes, format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Fake network time, so loading and skeleton states are real and demoable. */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Prices are stored as integer fils (1 AED = 100 fils) so totals never drift. */
export function formatAed(fils: number): string {
  return `${(fils / 100).toLocaleString("en-AE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatAedWithUnit(fils: number): string {
  return `AED ${formatAed(fils)}`;
}

export function formatTime(value: string | Date): string {
  return format(new Date(value), "HH:mm");
}

export function formatDayTime(value: string | Date): string {
  return format(new Date(value), "d MMM, HH:mm");
}

/** Elapsed minutes since a timestamp, floored at zero. */
export function minutesSince(value: string | Date, now: Date): number {
  return Math.max(0, differenceInMinutes(now, new Date(value)));
}

/** "4 min" / "1 h 12 min" — used on order tickets. */
export function formatElapsed(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  return `${hours} h ${minutes % 60} min`;
}

export function pluralize(count: number, singular: string, plural: string) {
  return count === 1 ? singular : plural;
}
