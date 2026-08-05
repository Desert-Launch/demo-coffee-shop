import type { Metadata } from "next";

import { PageContainer } from "@/components/layout/page-container";
import { CategoryJump, MenuBoard } from "@/features/menu";

export const metadata: Metadata = {
  title: "Menu",
  description:
    "Espresso, filter, cold, tea, bakery and kitchen. Prices in AED, ground to order in Al Quoz.",
};

export default function MenuPage() {
  return (
    <PageContainer className="py-14">
      <div className="border-b border-roast-700 pb-10">
        <p className="db-rail">Menu · updated when the roast changes</p>
        <h1 className="mt-5 max-w-2xl text-4xl leading-tight tracking-tighter text-chaff-50 md:text-5xl">
          Six categories, thirty-odd things, all made to order.
        </h1>
        <p className="mt-5 max-w-xl text-chaff-300">
          Pick your size and milk on the card, then add it to your order.
          Anything marked sold out has run for the day.
        </p>
        <div className="mt-8">
          <CategoryJump />
        </div>
      </div>

      <div className="pt-14">
        <MenuBoard />
      </div>
    </PageContainer>
  );
}
