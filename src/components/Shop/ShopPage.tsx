"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/trpc/react";
import { useTranslations } from "next-intl";
import {
  sortProducts,
  filterProducts,
  EMPTY_FILTERS,
  type ShopFilters,
} from "@/lib/utils/filterProducts";
import ShopFilterBar from "./ShopFilterBar";
import ShopPageError from "./ShopPageError";
import NoProducts from "./NoProducts";
import ProductCard from "./ProductCard";

export default function ShopPage() {
  const t = useTranslations("ShopPage");
  const searchParams = useSearchParams();
  const { data: products, isLoading, error } = api.product.getAll.useQuery();

  const [filters, setFilters] = useState<ShopFilters>(EMPTY_FILTERS);
  const [sortOption, setSortOption] = useState("newest");

  // Follow the global navbar search (?search=...) — reactive, so submitting
  // the navbar search while already on /shop applies immediately.
  useEffect(() => {
    const q = searchParams.get("search") ?? "";
    setFilters((prev) => (prev.search === q ? prev : { ...prev, search: q }));
  }, [searchParams]);

  const visibleProducts = useMemo(() => {
    if (!products) return [];
    return sortProducts(filterProducts(products, filters), sortOption);
  }, [products, filters, sortOption]);

  return (
    <div className="min-h-screen bg-[#f5f4f0] text-[#1a1a1a]">
      {/* Sticky filter/sort bar — sits right below the navbar (h-16). */}
      <div className="sticky top-[125px] z-40 border-b border-[#e0deda]/60 shadow-[0_1px_8px_rgba(0,0,0,0.03)] md:top-16">
        <ShopFilterBar
          products={products ?? []}
          filters={filters}
          setFilters={setFilters}
          sortOption={sortOption}
          setSortOption={setSortOption}
          onReset={() =>
            setFilters((prev) => ({ ...EMPTY_FILTERS, search: prev.search }))
          }
        />
      </div>

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        {isLoading ? (
          <div className="py-20 text-center text-sm text-[#888]">
            <p>{t("loading")}</p>
          </div>
        ) : error ? (
          <ShopPageError />
        ) : visibleProducts.length === 0 ? (
          <NoProducts />
        ) : (
          <div className="grid grid-cols-2 gap-x-3 gap-y-8 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-14">
            {visibleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
