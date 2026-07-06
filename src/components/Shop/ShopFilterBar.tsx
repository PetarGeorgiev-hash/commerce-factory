"use client";

import { useMemo } from "react";
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  getFacets,
  activeFilterCount,
  type ShopFilters,
} from "@/lib/utils/filterProducts";
import type { Product } from "@/lib/types/types";

const priceFilters = [
  { value: "all", label: "All prices" },
  { value: "under50", label: "Under €50" },
  { value: "50-100", label: "€50 – €100" },
  { value: "100-200", label: "€100 – €200" },
  { value: "over200", label: "Over €200" },
];

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "priceAsc", label: "Price: low to high" },
  { value: "priceDesc", label: "Price: high to low" },
];

type Props = {
  products: Product[];
  filters: ShopFilters;
  setFilters: (filters: ShopFilters) => void;
  sortOption: string;
  setSortOption: (value: string) => void;
  onReset: () => void;
};

export default function ShopFilterBar({
  products,
  filters,
  setFilters,
  sortOption,
  setSortOption,
  onReset,
}: Props) {
  const facets = useMemo(() => getFacets(products), [products]);
  const count = activeFilterCount(filters);

  function toggle(
    key: "categories" | "brands" | "sizes" | "colors",
    value: string,
  ) {
    const current = filters[key];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setFilters({ ...filters, [key]: next });
  }

  return (
    <div className="flex items-center justify-between bg-[#f5f4f0] px-4 py-3.5 sm:px-6 lg:px-8">
      {filters.search ? (
        <button
          onClick={() => {
            // Strip ?search= from the URL so the reactive seed doesn't re-apply it.
            window.history.replaceState({}, "", window.location.pathname);
            setFilters({ ...filters, search: "" });
          }}
          className="flex items-center gap-1.5 rounded-full border border-[#d5d3ce] px-3 py-1 text-[11px] text-[#444] transition hover:border-[#1a1a1a]"
        >
          “{filters.search}”
          <X className="h-3 w-3" />
        </button>
      ) : (
        <span />
      )}

      <Sheet>
        <SheetTrigger className="flex items-center gap-1.5 text-[12px] font-semibold tracking-[0.18em] uppercase transition outline-none hover:opacity-60">
          Filter & Sort
          <Plus className="h-3.5 w-3.5" />
          {count > 0 && (
            <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-[#1a1a1a] px-1 text-[10px] font-medium text-white">
              {count}
            </span>
          )}
        </SheetTrigger>

        <SheetContent
          side="right"
          className="w-full gap-0 border-[#e0deda] bg-[#f5f4f0] p-0 text-[#1a1a1a] sm:max-w-md"
        >
          <SheetHeader className="border-b border-[#e0deda] px-6 py-5">
            <SheetTitle className="text-[13px] font-semibold tracking-[0.2em] text-[#1a1a1a] uppercase">
              Filter & Sort
            </SheetTitle>
          </SheetHeader>

          <div className="flex-1 space-y-9 overflow-y-auto px-6 py-8">
            <FilterGroup title="Sort by">
              {sortOptions.map((o) => (
                <label
                  key={o.value}
                  className="flex cursor-pointer items-center gap-2.5 text-[13px] text-[#444] transition hover:text-[#1a1a1a]"
                >
                  <input
                    type="radio"
                    name="shop-sort"
                    checked={sortOption === o.value}
                    onChange={() => setSortOption(o.value)}
                    className="h-3.5 w-3.5 accent-[#1a1a1a]"
                  />
                  {o.label}
                </label>
              ))}
            </FilterGroup>

            {facets.categories.length > 0 && (
              <FilterGroup title="Category">
                {facets.categories.map((c) => (
                  <CheckRow
                    key={c}
                    label={c}
                    checked={filters.categories.includes(c)}
                    onChange={() => toggle("categories", c)}
                  />
                ))}
              </FilterGroup>
            )}

            {facets.brands.length > 0 && (
              <FilterGroup title="Brand">
                {facets.brands.map((b) => (
                  <CheckRow
                    key={b}
                    label={b}
                    checked={filters.brands.includes(b)}
                    onChange={() => toggle("brands", b)}
                  />
                ))}
              </FilterGroup>
            )}

            {facets.sizes.length > 0 && (
              <FilterGroup title="Size">
                <div className="flex flex-wrap gap-2">
                  {facets.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => toggle("sizes", s)}
                      className={cn(
                        "min-w-11 rounded border px-2 py-2 text-[12px] tracking-wide transition",
                        filters.sizes.includes(s)
                          ? "border-[#1a1a1a] bg-[#1a1a1a] text-white"
                          : "border-[#d5d3ce] text-[#1a1a1a] hover:border-[#1a1a1a]",
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </FilterGroup>
            )}

            <FilterGroup title="Price">
              {priceFilters.map((p) => (
                <label
                  key={p.value}
                  className="flex cursor-pointer items-center gap-2.5 text-[13px] text-[#444] transition hover:text-[#1a1a1a]"
                >
                  <input
                    type="radio"
                    name="shop-price"
                    checked={filters.priceFilter === p.value}
                    onChange={() =>
                      setFilters({ ...filters, priceFilter: p.value })
                    }
                    className="h-3.5 w-3.5 accent-[#1a1a1a]"
                  />
                  {p.label}
                </label>
              ))}
            </FilterGroup>

            {facets.colors.length > 0 && (
              <FilterGroup title="Color">
                <div className="flex flex-wrap gap-3">
                  {facets.colors.map((c) => (
                    <button
                      key={c.color}
                      onClick={() => toggle("colors", c.color)}
                      title={c.color}
                      className="flex flex-col items-center gap-1"
                    >
                      <span
                        className={cn(
                          "h-8 w-8 rounded-full border transition",
                          filters.colors.includes(c.color)
                            ? "border-[#1a1a1a] ring-2 ring-[#1a1a1a] ring-offset-1"
                            : "border-[#d5d3ce] hover:border-[#aaa]",
                        )}
                        style={{ backgroundColor: c.colorHex ?? "#ccc" }}
                      />
                      <span className="text-[10px] tracking-wide text-[#888]">
                        {c.color}
                      </span>
                    </button>
                  ))}
                </div>
              </FilterGroup>
            )}

            <FilterGroup title="Availability">
              <label className="flex cursor-pointer items-center gap-2.5 text-[13px] text-[#444] transition hover:text-[#1a1a1a]">
                <input
                  type="checkbox"
                  checked={filters.inStockOnly}
                  onChange={(e) =>
                    setFilters({ ...filters, inStockOnly: e.target.checked })
                  }
                  className="h-3.5 w-3.5 accent-[#1a1a1a]"
                />
                In stock only
              </label>
            </FilterGroup>
          </div>

          <div className="flex gap-3 border-t border-[#e0deda] px-6 py-4">
            {count > 0 && (
              <button
                onClick={onReset}
                className="flex h-12 flex-1 items-center justify-center gap-1.5 border border-[#1a1a1a] text-[12px] font-semibold tracking-[0.18em] uppercase transition hover:bg-[#e8e6e0]"
              >
                Clear all
              </button>
            )}
            <SheetClose className="flex h-12 flex-1 items-center justify-center bg-[#1a1a1a] text-[12px] font-semibold tracking-[0.18em] text-white uppercase transition hover:bg-[#333]">
              View results
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function FilterGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <p className="text-[11px] font-semibold tracking-[0.18em] text-[#888] uppercase">
        {title}
      </p>
      <div className="space-y-2.5">{children}</div>
    </div>
  );
}

function CheckRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-[13px] text-[#444] transition hover:text-[#1a1a1a]">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-3.5 w-3.5 accent-[#1a1a1a]"
      />
      {label}
    </label>
  );
}
