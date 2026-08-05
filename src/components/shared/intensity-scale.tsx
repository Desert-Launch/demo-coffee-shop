import { cn } from "@/lib/utils";

/**
 * The strength meter from a roastery bag label: five ticks, filled to the
 * item's intensity. Items with no coffee in them (bakery, kitchen) pass 0 and
 * render nothing.
 */
export function IntensityScale({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  if (value <= 0) return null;

  return (
    <div
      className={cn("flex items-center gap-[3px]", className)}
      role="img"
      aria-label={`Strength ${value} out of 5`}
    >
      {Array.from({ length: 5 }, (_, index) => (
        <span
          key={index}
          className={cn(
            "h-3 w-[3px] rounded-full transition-colors",
            index < value ? "bg-ember-500" : "bg-roast-600",
          )}
        />
      ))}
    </div>
  );
}
