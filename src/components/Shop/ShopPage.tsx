"use client";

import { useMemo, useState } from "react";
import { api } from "@/trpc/react";
import ShopSideBar from "./ShopSideBar";
import { sortProducts, filterProducts } from "@/lib/utils/filterProducts";
import ShopPageHeader from "./ShopPageHeader";
import { useTranslations } from "next-intl";
import ShopPageError from "./ShopPageError";
import NoProducts from "./NoProducts";
import ProductCard from "./ProductCard";

export default function ShopPage() {
  const t = useTranslations("ShopPage");
  const { data: products, isLoading, error } = api.product.getAll.useQuery();
  const [search, setSearch] = useState("");
  const [priceFilter, setPriceFilter] = useState("all");
  const [sortOption, setSortOption] = useState("newest");

  const visibleProducts = useMemo(() => {
    if (!products) return [];
    return sortProducts(filterProducts(products, search, priceFilter), sortOption);
  }, [products, search, priceFilter, sortOption]);

  return (
    <div className="mx-auto flex w-full max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:px-8">
      {/* <ShopSideBar
        products={products ?? []}
        visableProducts={visibleProducts}
        search={search}
        setSearch={setSearch}
        priceFilter={priceFilter}
        setPriceFilter={setPriceFilter}
        sortOption={sortOption}
        setSortOption={setSortOption}
      /> */}

      <main className="flex-1 space-y-6">
        {/* <ShopPageHeader /> */}

        {isLoading ? (
          <div className="border-border bg-card text-muted-foreground rounded-3xl border p-8 text-center text-sm shadow-sm">
            <p>{t("loading")}</p>
          </div>
        ) : error ? (
          <ShopPageError />
        ) : visibleProducts.length === 0 ? (
          <NoProducts />
        ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3">
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        )}
      </main>
    </div>
  );
}
