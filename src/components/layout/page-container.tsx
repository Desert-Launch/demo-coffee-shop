import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function PageContainer({
  children,
  className,
  as: Component = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "main" | "header" | "footer";
}) {
  return (
    <Component
      className={cn("mx-auto w-full max-w-page px-5 md:px-8", className)}
    >
      {children}
    </Component>
  );
}
