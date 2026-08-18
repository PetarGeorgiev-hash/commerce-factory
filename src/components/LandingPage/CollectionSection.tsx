import { ROUTES } from "@/lib/constants/routes";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import React from "react";

export default function CollectionSection() {
  return (
    <section className="border-t border-black/10 px-6 py-16 sm:py-24 lg:px-12">
      <div className="mb-10 flex items-end justify-between sm:mb-16">
        <div>
          <p className="mb-3 text-[10px] tracking-[0.35em] text-black/50 uppercase sm:text-[11px]">
            Latest Drop
          </p>
          <h2 className="text-2xl font-light tracking-[0.12em] uppercase sm:text-4xl">
            Minimal Luxury
          </h2>
        </div>

        <Link
          href={ROUTES.SHOP}
          className="text-[11px] tracking-[0.3em] uppercase underline-offset-4 hover:underline"
        >
          View All
        </Link>
      </div>

      {/* TODO: replace neutral placeholders with real drop imagery */}
      <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3">
        {["#e4e1da", "#dcd9d2", "#e8e5df"].map((bg, index) => (
          <Link
            key={index}
            href={ROUTES.SHOP}
            className={`group relative aspect-[4/5] overflow-hidden ${
              index === 2 ? "hidden md:block" : ""
            }`}
            style={{ backgroundColor: bg }}
          >
            <div className="absolute right-0 bottom-0 left-0 flex items-center justify-between p-4 text-[#1a1a1a] sm:p-6">
              <div>
                <p className="text-xs tracking-[0.25em] uppercase">
                  Essentials
                </p>
                <p className="mt-1 text-[11px] opacity-60">SS 2026</p>
              </div>
              <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
