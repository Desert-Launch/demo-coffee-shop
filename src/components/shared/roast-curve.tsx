import { cn } from "@/lib/utils";

/** Shared so the hero can draw the same trace with framer-motion. */
export const ROAST_CURVE_PATH =
  "M2 14 C 14 40, 26 56, 46 58 C 92 62, 132 34, 178 20 C 202 13, 222 10, 238 9";

/**
 * The house motif: a roast profile. Charge temperature drops to the turning
 * point, climbs through first crack, then flattens before the drop. It reads as
 * decoration at a glance and as a real instrument trace up close, which is the
 * point — the café is the front of a roastery.
 */
export function RoastCurve({
  className,
  showFirstCrack = false,
}: {
  className?: string;
  showFirstCrack?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 240 80"
      fill="none"
      aria-hidden
      className={cn("overflow-visible", className)}
    >
      <g stroke="currentColor" strokeOpacity="0.45" strokeWidth="1">
        <line x1="0" y1="70" x2="240" y2="70" />
        <line x1="0" y1="46" x2="240" y2="46" strokeDasharray="2 6" />
        <line x1="0" y1="22" x2="240" y2="22" strokeDasharray="2 6" />
      </g>

      <path
        d={ROAST_CURVE_PATH}
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        className="text-current"
      />

      {showFirstCrack ? (
        <g>
          <line
            x1="168"
            y1="6"
            x2="168"
            y2="70"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="3 4"
            strokeOpacity="0.8"
          />
          <circle cx="168" cy="23" r="3" fill="currentColor" />
        </g>
      ) : null}
    </svg>
  );
}
