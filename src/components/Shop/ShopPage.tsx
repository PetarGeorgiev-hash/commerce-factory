"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { api, type RouterOutputs } from "@/trpc/react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import ShopSideBar from "./ShopSideBar";
import { sortPosts, filterPosts } from "@/lib/utils/filterPosts";
import ShopPageHeader from "./ShopPageHeader";
import { useTranslations } from "next-intl";
import ShopPageError from "./ShopPageError";

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
        posts={posts}
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
