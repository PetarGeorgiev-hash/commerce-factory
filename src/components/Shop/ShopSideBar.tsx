"use client";

import { Input } from "@/components/ui/input";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { sortPosts, filterPosts } from "@/lib/utils/filterPosts";
import type { PostItem } from "@/lib/types/PostItem";

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
  posts,
  visiblePosts,
  search,
  setSearch,
  priceFilter,
  setPriceFilter,
  sortOption,
  setSortOption,
}: {
  posts: PostItem[];
  visiblePosts: PostItem[];
  search: string;
  setSearch: (search: string) => void;
  priceFilter: string;
  setPriceFilter: (priceFilter: string) => void;
  sortOption: string;
  setSortOption: (sortOption: string) => void;
}) {
  return (
    <aside className="border-border bg-card hidden w-72 shrink-0 space-y-6 rounded-3xl border p-6 shadow-sm md:block">
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Filter items</h2>
        <p className="text-muted-foreground text-sm">
          Search and filter posts to find the best item.
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="shop-search" className="text-sm font-medium">
          Search
        </label>
        <Input
          id="shop-search"
          placeholder="Search title or description"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Price range</p>
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
        <p className="text-sm font-medium">Sort by</p>
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
        <p className="font-semibold">Results</p>
        <p className="text-muted-foreground">
          Showing {visiblePosts.length} of {posts?.length ?? 0} items
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
          Reset filters
        </Button>
      </div>
    </aside>
  );
}

export default ShopSideBar;
