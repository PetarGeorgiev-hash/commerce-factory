"use client";

import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ProductsPage() {
  const { data, refetch } = api.product.getAll.useQuery();

  const deleteProduct = api.product.delete.useMutation({
    onSuccess: () => refetch(),
  });

  const router = useRouter();

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Products</h1>

      <div className="overflow-x-auto rounded border">
        <table className="w-full text-left">
          <thead className="bg-muted">
            <tr className="border-t hover:bg-muted/50">
              <th className="p-3">Title</th>
              <th className="p-3">Price</th>
              <th className="p-3">Created</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {data?.map((product) => (
              <tr key={product.id} className="border-t hover:bg-muted/50">
                <td className="p-3 font-medium">{product.name}</td>

                <td className="p-3">
                  {product.price ? `$${product.price}` : "—"}
                </td>

                <td className="p-3 text-sm text-muted-foreground">
                  {new Date(product.createdAt).toLocaleDateString()}
                </td>

                <td className="p-3">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      onClick={() =>
                        router.push(`/admin/products/${product.id}`)
                      }
                    >
                      Edit
                    </Button>

                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() =>
                        deleteProduct.mutate({ id: product.id })
                      }
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}

            {data?.length === 0 && (
              <tr className="border-t hover:bg-muted/50">
                <td className="p-4 text-center text-muted-foreground" colSpan={4}>
                  No products yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}