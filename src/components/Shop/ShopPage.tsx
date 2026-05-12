"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { api, type RouterOutputs } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type PostItem = RouterOutputs["post"]["getAll"][number];

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

function filterPosts(posts: PostItem[], search: string, priceFilter: string) {
  return posts.filter((post) => {
    const query = search.trim().toLowerCase();
    const matchesSearch =
      !query ||
      post.title.toLowerCase().includes(query) ||
      (post.description?.toLowerCase().includes(query) ?? false);

    const price = post.price ?? 0;
    const matchesPrice =
      priceFilter === "all" ||
      (priceFilter === "under50" && price < 50) ||
      (priceFilter === "50-100" && price >= 50 && price <= 100) ||
      (priceFilter === "over100" && price > 100);

    return matchesSearch && matchesPrice;
  });
}

function sortPosts(posts: PostItem[], sortOption: string) {
  return [...posts].sort((a, b) => {
    if (sortOption === "priceAsc") {
      return (a.price ?? 0) - (b.price ?? 0);
    }
    if (sortOption === "priceDesc") {
      return (b.price ?? 0) - (a.price ?? 0);
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

export default function ShopPage() {
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

      <main className="flex-1 space-y-6">
        <div className="border-border bg-card space-y-3 rounded-3xl border p-6 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-muted-foreground text-sm tracking-[0.2em] uppercase">
                Shop
              </p>
              <h1 className="text-3xl font-semibold">All available posts</h1>
            </div>
            <p className="text-muted-foreground max-w-2xl text-sm">
              Browse posts from sellers and use the sidebar filters to narrow
              the results.
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="border-border bg-card text-muted-foreground rounded-3xl border p-8 text-center text-sm shadow-sm">
            Loading shop items...
          </div>
        ) : error ? (
          <div className="border-destructive/30 bg-destructive/10 text-destructive rounded-3xl border p-8 text-center text-sm shadow-sm">
            Failed to load items. Please refresh the page.
          </div>
        ) : visiblePosts.length === 0 ? (
          <div className="border-border bg-card rounded-3xl border p-8 text-center shadow-sm">
            <p className="text-xl font-semibold">
              No items match your filters.
            </p>
            <p className="text-muted-foreground mt-2 text-sm">
              Try adjusting search terms or price range.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {visiblePosts.map((post) => (
              <Card key={post.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <CardTitle>{post.title}</CardTitle>
                      <CardDescription>
                        {post.description ?? "No description provided."}
                      </CardDescription>
                    </div>
                    {post.price != null && (
                      <div className="text-right">
                        <p className="text-lg font-semibold">
                          ${post.price.toFixed(2)}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          Posted{" "}
                          {formatDistanceToNow(new Date(post.createdAt), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="grid gap-4">
                  {post.imageUrl ? (
                    <div className="relative h-72 w-full overflow-hidden rounded-3xl bg-slate-100">
                      <Image
                        src={post.imageUrl}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="border-border bg-muted text-muted-foreground flex h-72 items-center justify-center rounded-3xl border border-dashed text-sm">
                      No image available
                    </div>
                  )}

                  <div className="text-muted-foreground flex flex-wrap gap-2 text-sm">
                    <span className="bg-muted rounded-full px-3 py-1">
                      ID: {post.id.slice(0, 8)}
                    </span>
                    <span className="bg-muted rounded-full px-3 py-1">
                      Created{" "}
                      {formatDistanceToNow(new Date(post.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
