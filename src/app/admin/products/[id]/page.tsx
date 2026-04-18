"use client";

import { api } from "@/trpc/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function EditPage() {
  const { id } = useParams();
  const router = useRouter();

  const utils = api.useUtils();

  const { data, isLoading } = api.product.getById.useQuery({
    id: id as string,
  });

  const updateProduct = api.product.update.useMutation({
    onSuccess: async () => {
      await utils.product.getAll.invalidate(); // 🔥 refresh list
      router.push("/admin/products"); // go back to list
    },
  });

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    if (data) {
      setName(data.name ?? "");
      setPrice(data.price?.toString() ?? "");
    }
  }, [data]);

  if (isLoading) return <div className="p-6">Loading product...</div>;

  if (!data) return <div className="p-6">Product not found</div>;

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>Edit Product</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium">Name</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium">Price</label>
          <Input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        <Button
          disabled={updateProduct.isPending}
          onClick={() =>
            updateProduct.mutate({
              id: id as string,
              name,
              price: price ? parseFloat(price) : undefined,
            })
          }
        >
          {updateProduct.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </CardContent>
    </Card>
  );
}