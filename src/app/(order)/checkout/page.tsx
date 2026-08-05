import type { Metadata } from "next";

import { PageContainer } from "@/components/layout/page-container";
import { CheckoutWizard } from "@/features/checkout";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Choose pickup or delivery, pick a time and place your order.",
};

export default function CheckoutPage() {
  return (
    <PageContainer className="py-14">
      <CheckoutWizard />
    </PageContainer>
  );
}
