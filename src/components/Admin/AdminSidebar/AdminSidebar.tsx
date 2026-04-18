"use client";

import Link from "next/link";
import { LayoutDashboard, Plus, List, BarChart } from "lucide-react";

export const AdminSidebar = () => {
  return (
    <nav className="space-y-2">
      <Link href="/admin/activity" className="flex items-center gap-2 p-2 rounded hover:bg-accent">
        <LayoutDashboard size={18} />
        Dashboard
      </Link>

      <Link href="/admin/add" className="flex items-center gap-2 p-2 rounded hover:bg-accent">
        <Plus size={18} />
        Add Product
      </Link>

      <Link href="/admin/products" className="flex items-center gap-2 p-2 rounded hover:bg-accent">
        <List size={18} />
        Products
      </Link>

      <Link href="/admin/metrics" className="flex items-center gap-2 p-2 rounded hover:bg-accent">
        <BarChart size={18} />
        Metrics
      </Link>
    </nav>
  );
};