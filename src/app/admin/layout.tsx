import type { Metadata } from "next";
import type { ReactNode } from "react";

import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { AdminTopbar } from "@/components/layout/admin-topbar";

export const metadata: Metadata = {
  title: {
    default: "Bar",
    template: "%s · Dune & Bean bar",
  },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh bg-roast-950">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar />
        <main id="main" className="flex-1 px-5 py-8 md:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
