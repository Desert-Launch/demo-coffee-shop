import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  /** Context under the number — never a bare percentage with no referent. */
  detail?: string;
  icon?: ReactNode;
  className?: string;
}

export function StatCard({
  label,
  value,
  detail,
  icon,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-roast-700 bg-roast-800 p-5",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="db-rail">{label}</p>
        {icon ? (
          <span aria-hidden className="text-chaff-600">
            {icon}
          </span>
        ) : null}
      </div>
      <p className="tnum mt-3 text-3xl leading-flat text-chaff-50">{value}</p>
      {detail ? <p className="mt-2 text-xs text-chaff-400">{detail}</p> : null}
    </div>
  );
}
