import { AdminSidebar } from "@/components/Admin/AdminSidebar/AdminSidebar";
import type { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r bg-muted/40 p-4">
        <AdminSidebar />
      </aside>
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}