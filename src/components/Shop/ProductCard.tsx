"use client";

import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import type { PostItem } from "@/lib/types/PostItem";
import { useTranslations } from "next-intl";

export default function ProductCard({ post }: { post: PostItem }) {
  const t = useTranslations("ShopPage.ProductCard");

  return (
    <Card key={post.id} className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle>{post.title}</CardTitle>
            <CardDescription>
              {post.description ?? t("noDescription")}
            </CardDescription>
          </div>
          {post.price != null && (
            <div className="text-right">
              <p className="text-lg font-semibold">${post.price.toFixed(2)}</p>
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
            {t("noImage")}
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
  );
}
