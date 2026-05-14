import { ROUTES } from "@/lib/constants/routes";
import Link from "next/link";
import React from "react";

export default function CollectionSection() {
  return (
    <section className="border-t border-black/10 px-6 py-24 lg:px-12 dark:border-white/10">
      <div className="mb-16 flex items-end justify-between">
        <div>
          <p className="mb-3 text-[11px] tracking-[0.35em] text-black/50 uppercase dark:text-white/50">
            Latest Drop
          </p>

          <h2 className="text-4xl font-light tracking-[0.12em] uppercase">
            Minimal Luxury
          </h2>
        </div>

        <Link
          href={ROUTES.SHOP}
          className="text-[12px] tracking-[0.35em] uppercase underline-offset-4 hover:underline"
        >
          View All
        </Link>
      </div>
    {/* Add real images when available */}
      {/* <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1200&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1523398002811-999ca8dec234?q=80&w=1200&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1200&auto=format&fit=crop",
          ].map((image, index) => (
            <div
              key={index}
              className="group relative aspect-[4/5] overflow-hidden bg-[#ecece7]"
            >
              <Image
                src={image}
                alt="Collection"
                fill
                className="object-cover transition duration-700 group-hover:scale-[1.03]"
              />

              <div className="absolute right-0 bottom-0 left-0 flex items-center justify-between bg-gradient-to-t from-black/60 to-transparent p-6 text-white">
                <div>
                  <p className="text-sm tracking-[0.25em] uppercase">
                    Essentials
                  </p>

                  <p className="mt-1 text-xs opacity-70">
                    Spring / Summer 2026
                  </p>
                </div>

                <ChevronRight className="h-5 w-5" />
              </div>
            </div>
          ))}
        </div> */}
    </section>
  );
}
