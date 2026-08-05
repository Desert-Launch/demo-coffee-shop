"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu as MenuIcon, ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { PageContainer } from "@/components/layout/page-container";
import { Wordmark } from "@/components/layout/wordmark";
import { useCartCount, useCartPanel } from "@/features/cart";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/menu", label: "Menu" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const pathname = usePathname();
  const count = useCartCount();
  const { setOpen } = useCartPanel();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-roast-700 bg-roast-950/92 backdrop-blur-md">
      {/* The label rail — what is actually on the hopper today. */}
      <div className="hidden border-b border-roast-700/70 md:block">
        <PageContainer className="flex h-8 items-center justify-between">
          <p className="db-rail flex items-center gap-2">
            <span
              aria-hidden
              className="inline-block size-1.5 rounded-full bg-ember-500"
            />
            On the hopper · Wadi lot 07 · washed · 1,450 m
          </p>
          <p className="db-rail">Al Quoz 3 · 06:00—01:00 daily</p>
        </PageContainer>
      </div>

      <PageContainer className="flex h-16 items-center justify-between gap-6">
        <Wordmark />

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-8">
            {LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative py-1 text-sm transition-colors",
                      active
                        ? "text-chaff-50"
                        : "text-chaff-300 hover:text-chaff-50",
                    )}
                  >
                    {link.label}
                    {active ? (
                      <span
                        aria-hidden
                        className="absolute -bottom-0.5 left-0 h-px w-full bg-ember-500"
                      />
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Button
            size="lg"
            variant={count > 0 ? "default" : "outline"}
            onClick={() => setOpen(true)}
            aria-label={
              count > 0
                ? `Open your order, ${count} ${count === 1 ? "item" : "items"}`
                : "Open your order"
            }
          >
            <ShoppingBag data-icon="inline-start" />
            <span className="hidden sm:inline">Your order</span>
            {count > 0 ? <span className="tnum ml-1">{count}</span> : null}
          </Button>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                size="icon-lg"
                variant="ghost"
                className="md:hidden"
                aria-label="Open menu"
              >
                <MenuIcon />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-72 border-roast-700 bg-roast-900"
            >
              <SheetHeader>
                <SheetTitle className="font-display">Dune &amp; Bean</SheetTitle>
              </SheetHeader>
              <nav aria-label="Main" className="px-4">
                <ul className="flex flex-col gap-1">
                  {LINKS.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className="block rounded-md px-3 py-3 text-base text-chaff-100 hover:bg-roast-800"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link
                      href="/admin"
                      onClick={() => setMobileOpen(false)}
                      className="block rounded-md px-3 py-3 text-base text-chaff-400 hover:bg-roast-800"
                    >
                      Staff view
                    </Link>
                  </li>
                </ul>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </PageContainer>
    </header>
  );
}
