import { addMinutes, format, getHours, setMinutes, setSeconds } from "date-fns";

export interface TimeSlot {
  /** ISO timestamp, or the literal "asap". */
  value: string;
  label: string;
  /** Falls outside 06:00–01:00, so the bar is shut. */
  disabled: boolean;
}

export const ASAP_SLOT = "asap";

const OPENS_AT_HOUR = 6;
const CLOSES_AT_HOUR = 1; // 01:00 the next morning
const LEAD_MINUTES = 20;
const STEP_MINUTES = 15;

function isOpenAt(date: Date): boolean {
  const hour = getHours(date);
  return hour >= OPENS_AT_HOUR || hour < CLOSES_AT_HOUR;
}

/**
 * Slots start at the next quarter hour after the bar's lead time and run in
 * fifteen-minute steps. Anything outside opening hours is rendered but
 * unselectable, so the closing time is visible rather than implied.
 */
export function generateSlots(now: Date, count = 10): TimeSlot[] {
  const lead = addMinutes(now, LEAD_MINUTES);
  const rounded = setSeconds(
    setMinutes(lead, Math.ceil(lead.getMinutes() / STEP_MINUTES) * STEP_MINUTES),
    0,
  );

  return Array.from({ length: count }, (_, index) => {
    const at = addMinutes(rounded, index * STEP_MINUTES);
    return {
      value: at.toISOString(),
      label: format(at, "HH:mm"),
      disabled: !isOpenAt(at),
    };
  });
}

export function describeSlot(value: string, leadMinutes: number): string {
  if (value === ASAP_SLOT) return `As soon as possible · about ${leadMinutes} min`;
  return `Scheduled for ${format(new Date(value), "HH:mm")}`;
}
