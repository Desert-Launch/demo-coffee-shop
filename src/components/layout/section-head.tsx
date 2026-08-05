import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface SectionHeadProps {
  /** Mono metadata that says something true about the section, not a number. */
  rail: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  id?: string;
}

export function SectionHead({
  rail,
  title,
  description,
  action,
  className,
  id,
}: SectionHeadProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center gap-4">
        <span className="db-rail whitespace-nowrap">{rail}</span>
        <span className="h-px flex-1 bg-roast-700" aria-hidden />
      </div>
      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-xl">
          <h2 id={id} className="text-3xl md:text-4xl text-chaff-50">
            {title}
          </h2>
          {description ? (
            <p className="mt-3 text-chaff-300">{description}</p>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    </div>
  );
}
