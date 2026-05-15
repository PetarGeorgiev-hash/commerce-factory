import { ROUTES } from "@/lib/constants/routes";
import Link from "next/link";
import React from "react";

export default function LogoHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-slate-300 text-black backdrop-blur dark:bg-slate-700 dark:text-white">
      <div className="flex h-16 items-center justify-between px-6 lg:px-10">
        <div className="absolute left-1/2 -translate-x-1/2">
          <Link
            href={ROUTES.HOME}
            className="text-xl font-semibold tracking-[0.35em] uppercase"
          >
            Name of Brand
          </Link>
        </div>
      </div>
    </header>
  );
}
