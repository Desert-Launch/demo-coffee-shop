import type { Metadata } from "next";

import { AdminMenuTable } from "@/features/menu";

export const metadata: Metadata = { title: "Menu" };

export default function AdminMenuPage() {
  return <AdminMenuTable />;
}
