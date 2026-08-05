"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ClipboardList,
  ExternalLink,
  LayoutDashboard,
  RotateCcw,
  UtensilsCrossed,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Wordmark } from "@/components/layout/wordmark";
import { useResetDemoData } from "@/features/dashboard";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/orders", label: "Order board", icon: ClipboardList },
  { href: "/admin/menu", label: "Menu", icon: UtensilsCrossed },
] as const;

export function AdminNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const reset = useResetDemoData();

  async function handleReset() {
    await reset.mutateAsync();
    toast.success("Demo data reset", {
      description: "The menu and today's orders are back to the seeded day.",
    });
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-2 border-b border-roast-700 px-5">
        <Wordmark href="/admin" />
        <span className="rounded-sm border border-roast-600 px-1.5 py-0.5 font-mono text-2xs tracking-widest text-chaff-400 uppercase">
          Bar
        </span>
      </div>

      <nav aria-label="Staff" className="flex-1 px-3 py-5">
        <ul className="space-y-1">
          {NAV.map((item) => {
            const active =
              "exact" in item && item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors",
                    active
                      ? "bg-roast-800 text-chaff-50"
                      : "text-chaff-300 hover:bg-roast-800/60 hover:text-chaff-50",
                  )}
                >
                  <Icon
                    className={cn(
                      "size-4",
                      active ? "text-ember-500" : "text-chaff-400",
                    )}
                  />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="space-y-3 border-t border-roast-700 p-4">
        <Link
          href="/"
          onClick={onNavigate}
          className="flex items-center gap-2 px-2 text-xs text-chaff-400 transition-colors hover:text-ember-400"
        >
          <ExternalLink className="size-3.5" />
          Open the customer site
        </Link>
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start"
          onClick={() => void handleReset()}
          disabled={reset.isPending}
        >
          <RotateCcw data-icon="inline-start" />
          {reset.isPending ? "Resetting…" : "Reset demo data"}
        </Button>
        <p className="px-2 text-2xs leading-snug text-chaff-400">
          Everything lives in memory. A hard refresh reseeds the day.
        </p>
      </div>
    </div>
  );
}

export function AdminSidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-roast-700 bg-roast-900 lg:block">
      <div className="sticky top-0 h-dvh">
        <AdminNav />
      </div>
    </aside>
  );
}
