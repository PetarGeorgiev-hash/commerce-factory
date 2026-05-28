"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { ROUTES } from "@/lib/constants/routes";

export default function ProductsPage() {
  const router = useRouter();
  const { data: products, isLoading, refetch } = api.product.getAll.useQuery();
  const deleteProduct = api.product.delete.useMutation({ onSuccess: () => refetch() });
  const [confirmId, setConfirmId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="space-y-3 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-black border-t-transparent" />
          <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Loading</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-100 px-8 py-8">
        <div className="mx-auto flex max-w-7xl items-end justify-between">
          <div>
            <p className="mb-1 text-xs uppercase tracking-[0.25em] text-gray-400">Admin</p>
            <h1 className="font-serif text-4xl font-light tracking-tight text-black">Products</h1>
            <p className="mt-1 text-sm text-gray-400">{products?.length ?? 0} items</p>
          </div>
          <button
            onClick={() => router.push(ROUTES.ADMIN_CREATE_PRODUCT)}
            className="flex items-center gap-2 bg-black px-6 py-3 text-xs uppercase tracking-[0.15em] text-white transition-opacity hover:opacity-70"
          >
            <Plus className="h-3.5 w-3.5" />
            New Product
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="mx-auto max-w-7xl px-8 py-10">
        {!products?.length ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="mb-6 h-px w-16 bg-gray-200" />
            <p className="text-xs uppercase tracking-[0.2em] text-gray-400">No products yet</p>
            <button
              onClick={() => router.push("/admin/products/create")}
              className="mt-6 text-xs uppercase tracking-[0.15em] underline underline-offset-4"
            >
              Create your first product
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {/* Column headers */}
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-6 pb-4 text-xs uppercase tracking-[0.15em] text-gray-400">
              <span>Product</span>
              <span>Brand</span>
              <span>Category</span>
              <span>Variants</span>
              <span />
            </div>

            {products.map((product) => (
              <div
                key={product.id}
                className="group grid grid-cols-[2fr_1fr_1fr_1fr_auto] items-center gap-6 py-5"
              >
                {/* Product info */}
                <div className="flex items-center gap-4">
                  {/* First image thumbnail */}
                  {product.variants[0]?.images[0] ? (
                    <img
                      src={product.variants[0].images[0]}
                      alt={product.title}
                      className="h-14 w-14 object-cover grayscale transition-all group-hover:grayscale-0"
                    />
                  ) : (
                    <div className="h-14 w-14 bg-gray-50" />
                  )}
                  <div>
                    <p className="text-sm font-medium tracking-wide text-black">{product.title}</p>
                    {product.description && (
                      <p className="mt-0.5 line-clamp-1 max-w-xs text-xs text-gray-400">
                        {product.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Brand */}
                <p className="text-sm text-gray-500">{product.brand ?? "—"}</p>

                {/* Category */}
                <p className="text-sm text-gray-500">{product.category ?? "—"}</p>

                {/* Variants count */}
                <p className="text-sm text-gray-500">
                  {product.variants.length} {product.variants.length === 1 ? "variant" : "variants"}
                </p>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => router.push(`/admin/products/${product.id}`)}
                    className="rounded p-2 text-gray-400 transition-colors hover:bg-gray-50 hover:text-black"
                    title="Edit"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>

                  {confirmId === product.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          deleteProduct.mutate({ id: product.id });
                          setConfirmId(null);
                        }}
                        className="rounded bg-black px-3 py-1.5 text-xs text-white"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setConfirmId(null)}
                        className="rounded px-3 py-1.5 text-xs text-gray-400 hover:text-black"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmId(product.id)}
                      className="rounded p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}