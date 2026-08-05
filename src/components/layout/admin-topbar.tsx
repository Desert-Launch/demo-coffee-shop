"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu as MenuIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AdminNav } from "@/components/layout/admin-sidebar";
import { STAFF_ROSTER, useStaffStore } from "@/features/staff";

const TITLES: Record<string, string> = {
  "/admin": "Overview",
  "/admin/orders": "Order board",
  "/admin/menu": "Menu",
};

export function AdminTopbar() {
  const pathname = usePathname();
  const current = useStaffStore((state) => state.current);
  const setCurrent = useStaffStore((state) => state.setCurrent);
  const [navOpen, setNavOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-roast-700 bg-roast-950/92 px-5 backdrop-blur-md md:px-8">
      <div className="flex items-center gap-3">
        <Sheet open={navOpen} onOpenChange={setNavOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon-lg"
              className="lg:hidden"
              aria-label="Open staff menu"
            >
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-72 border-roast-700 bg-roast-900 p-0"
          >
            <SheetHeader className="sr-only">
              <SheetTitle>Staff menu</SheetTitle>
            </SheetHeader>
            <AdminNav onNavigate={() => setNavOpen(false)} />
          </SheetContent>
        </Sheet>

        <h1 className="font-display text-lg font-semibold text-chaff-50">
          {TITLES[pathname] ?? "Bar"}
        </h1>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="lg" className="gap-2">
            <span className="flex size-6 items-center justify-center rounded-full bg-ember-950 font-mono text-2xs text-ember-300">
              {current.initials}
            </span>
            <span className="hidden text-sm sm:inline">{current.name}</span>
            <ChevronDown className="size-3.5 text-chaff-400" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-60">
          <DropdownMenuLabel className="db-rail">
            On shift — demo only
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {STAFF_ROSTER.map((member) => (
            <DropdownMenuItem
              key={member.id}
              onSelect={() => setCurrent(member.id)}
            >
              <span className="flex size-6 items-center justify-center rounded-full bg-roast-750 font-mono text-2xs text-chaff-300">
                {member.initials}
              </span>
              <span className="flex flex-col">
                <span className="text-sm text-chaff-100">{member.name}</span>
                <span className="text-xs text-chaff-400">{member.role}</span>
              </span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
