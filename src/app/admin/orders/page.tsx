import type { Metadata } from "next";

import { OrderBoard } from "@/features/orders";

export const metadata: Metadata = { title: "Order board" };

export default function AdminOrdersPage() {
  return <OrderBoard />;
}
