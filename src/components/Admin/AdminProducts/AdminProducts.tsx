"use client";

import { api } from "@/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import NoProducts from "./NoProducts";

const ProductTimeline = () => {
  const { data: products, isLoading } = api.product.getAll.useQuery();

  if (isLoading)
    return <div className="py-8 text-center">Loading products...</div>;

  if (!products || products.length === 0) return <NoProducts />;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Products</h2>

      <div className="space-y-4">
        {products.map((product, index) => (
          <div key={product.id} className="flex gap-4">
            {/* Timeline dot */}
            <div className="flex flex-col items-center">
              <div className="bg-primary h-4 w-4 rounded-full"></div>

              {index !== products.length - 1 && (
                <div className="bg-border h-12 w-1"></div>
              )}
            </div>

            {/* Product card */}
            <Card className="flex-1">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle>{product.name}</CardTitle>

                  {product.price && (
                    <Badge variant="secondary">
                      ${product.price.toFixed(2)}
                    </Badge>
                  )}
                </div>

                <p className="text-muted-foreground text-xs">
                  {formatDistanceToNow(new Date(product.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </CardHeader>

              <CardContent className="space-y-3">
                {product.images?.length > 0 && product.images[0] && (
                  <div className="relative h-48 w-full">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="rounded-lg object-cover"
                    />
                  </div>
                )}
                {product.description && (
                  <p className="text-sm text-foreground">
                    {product.description}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductTimeline;