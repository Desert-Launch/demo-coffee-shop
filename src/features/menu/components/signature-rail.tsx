"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SectionHead } from "@/components/layout/section-head";
import { useMenu } from "../hooks/use-menu";
import { MenuCardSkeleton } from "./menu-card-skeleton";
import { MenuItemCard } from "./menu-item-card";

/** The four drinks the bar is known for, ordered straight from the home page. */
export function SignatureRail() {
  const { data, isPending } = useMenu();
  const signatures = (data ?? []).filter((item) => item.isSignature).slice(0, 4);

  return (
    <section aria-labelledby="signatures-heading">
      <SectionHead
        id="signatures-heading"
        rail="What people come back for"
        title="The four we are known for"
        description="Everything else on the menu is good. These are the ones regulars order without looking."
        action={
          <Button asChild variant="outline" size="lg">
            <Link href="/menu">
              See the full menu
              <ArrowRight data-icon="inline-end" />
            </Link>
          </Button>
        }
      />

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        {isPending
          ? Array.from({ length: 4 }, (_, index) => (
              <MenuCardSkeleton key={index} />
            ))
          : signatures.map((item) => (
              <MenuItemCard key={item.id} item={item} />
            ))}
      </div>
    </section>
  );
}
