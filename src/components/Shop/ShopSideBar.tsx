"use client";

import { Input } from "@/components/ui/input";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { sortProducts, filterProducts } from "@/lib/utils/filterProducts";
import type {  ProductItem } from "@/lib/types/types";
import { useTranslations } from "next-intl";

const priceFilters = [
  { value: "all", label: "All prices" },
  { value: "under50", label: "Under $50" },
  { value: "50-100", label: "$50 - $100" },
  { value: "over100", label: "Over $100" },
];

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "priceAsc", label: "Price: low to high" },
  { value: "priceDesc", label: "Price: high to low" },
];

function ShopSideBar({
  products,
  visableProducts,
  search,
  setSearch,
  priceFilter,
  setPriceFilter,
  sortOption,
  setSortOption,
}: {
  products: ProductItem[];
  visableProducts: ProductItem[];
  search: string;
  setSearch: (search: string) => void;
  priceFilter: string;
  setPriceFilter: (priceFilter: string) => void;
  sortOption: string;
  setSortOption: (sortOption: string) => void;
}) {
  const t = useTranslations("ShopPage.ShopSideBar");
  return (
    <aside className="border-border bg-card hidden w-72 shrink-0 space-y-6 rounded-3xl border p-6 shadow-sm md:block">
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">{t("filterItems")}</h2>
        <p className="text-muted-foreground text-sm">{t("searchTitle")}</p>
      </div>

      <div className="space-y-2">
        <label htmlFor="shop-search" className="text-sm font-medium">
          {t("searchLabel")}
        </label>
        <Input
          id="shop-search"
          placeholder={t("searchPlaceholder")}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">{t("priceRange")}</p>
        <div className="grid gap-2">
          {priceFilters.map((filter) => (
            <Button
              key={filter.value}
              variant={priceFilter === filter.value ? "default" : "outline"}
              size="sm"
              className="justify-start"
              onClick={() => setPriceFilter(filter.value)}
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">{t("sortByLabel")}</p>
        <div className="grid gap-2">
          {sortOptions.map((option) => (
            <Button
              key={option.value}
              variant={sortOption === option.value ? "default" : "outline"}
              size="sm"
              className="justify-start"
              onClick={() => setSortOption(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="bg-muted space-y-1 rounded-2xl p-4 text-sm">
        <p className="font-semibold">{t("results")}</p>
        <p className="text-muted-foreground">
          Showing {visableProducts.length} of {products?.length ?? 0} items
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setSearch("");
            setPriceFilter("all");
            setSortOption("newest");
          }}
        >
          {t("resetFilters")}
        </Button>
      </div>
    </aside>
  );
}

export default ShopSideBar;
