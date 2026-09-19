import Link from "next/link";

import { cn } from "@/lib/utils";

export function Wordmark({
  className,
  href = "/",
}: {
  className?: string;
  href?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "font-display text-lg font-bold tracking-tighter text-chaff-50",
        className,
      )}
    >
      Demo <span className="text-ember-500">Café</span>
    </Link>
  );
}
