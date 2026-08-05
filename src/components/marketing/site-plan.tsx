import { cn } from "@/lib/utils";

/**
 * A drawn site plan of the warehouse block instead of an embedded map. Nothing
 * loads from a third party and it matches the rest of the drawn-instrument
 * language.
 */
export function SitePlan({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg border border-roast-700 bg-roast-850",
        className,
      )}
    >
      <svg
        viewBox="0 0 320 200"
        fill="none"
        role="img"
        aria-label="Site plan: Dune and Bean occupies warehouse 14 on street 8, Al Quoz 3, on the corner of street 8 and 4b."
        className="h-full w-full"
      >
        {/* Blocks */}
        <g fill="var(--db-roast-800)" stroke="var(--db-roast-700)">
          <rect x="12" y="16" width="120" height="64" rx="2" />
          <rect x="12" y="122" width="86" height="62" rx="2" />
          <rect x="196" y="16" width="112" height="64" rx="2" />
          <rect x="196" y="122" width="112" height="62" rx="2" />
        </g>

        {/* Streets */}
        <g stroke="var(--db-roast-600)" strokeDasharray="6 8" strokeWidth="1.5">
          <line x1="0" y1="101" x2="320" y2="101" />
          <line x1="164" y1="0" x2="164" y2="200" />
        </g>

        {/* Our unit */}
        <rect
          x="112"
          y="122"
          width="70"
          height="62"
          rx="2"
          fill="var(--db-ember-950)"
          stroke="var(--db-ember-500)"
          strokeWidth="1.5"
        />
        <circle cx="147" cy="153" r="5" fill="var(--db-ember-500)" />

        <g
          fill="var(--db-chaff-400)"
          fontFamily="var(--db-family-mono)"
          fontSize="9"
          letterSpacing="1.4"
        >
          <text x="16" y="96">
            STREET 4B
          </text>
          <text x="170" y="196">
            STREET 8
          </text>
        </g>
        <text
          x="112"
          y="115"
          fill="var(--db-ember-400)"
          fontFamily="var(--db-family-mono)"
          fontSize="9"
          letterSpacing="1.4"
        >
          WAREHOUSE 14
        </text>
      </svg>
    </div>
  );
}
