"use client";

import { useMemo, useState } from "react";
import { api } from "@/trpc/react";
import ShopSideBar from "./ShopSideBar";
import { sortPosts, filterPosts } from "@/lib/utils/filterPosts";
import ShopPageHeader from "./ShopPageHeader";
import { useTranslations } from "next-intl";
import ShopPageError from "./ShopPageError";
import NoProducts from "./NoProducts";
import ProductCard from "./ProductCard";

export default function ShopPage() {
  const t = useTranslations("ShopPage");
  const { data: posts, isLoading, error } = api.post.getAll.useQuery();
  const [search, setSearch] = useState("");
  const [priceFilter, setPriceFilter] = useState("all");
  const [sortOption, setSortOption] = useState("newest");

  const visiblePosts = useMemo(() => {
    if (!posts) return [];
    return sortPosts(filterPosts(posts, search, priceFilter), sortOption);
  }, [posts, search, priceFilter, sortOption]);

  return (
    <div className="mx-auto flex w-full max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <ShopSideBar
        posts={posts ?? []}
        visiblePosts={visiblePosts}
        search={search}
        setSearch={setSearch}
        priceFilter={priceFilter}
        setPriceFilter={setPriceFilter}
        sortOption={sortOption}
        setSortOption={setSortOption}
      />

      <main className="flex-1 space-y-6">
        <ShopPageHeader />

        {isLoading ? (
          <div className="border-border bg-card text-muted-foreground rounded-3xl border p-8 text-center text-sm shadow-sm">
            <p>{t("loading")}</p>
          </div>
        ) : error ? (
          <ShopPageError />
        ) : visiblePosts.length === 0 ? (
          <NoProducts />
        ) : (
          <div className="grid gap-6">
            {visiblePosts.map((post) => (
              <ProductCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
