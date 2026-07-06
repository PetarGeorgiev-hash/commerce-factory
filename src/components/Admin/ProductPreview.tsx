"use client";

import { useEffect, useMemo, useState } from "react";
import { Eye, X } from "lucide-react";
import { Product, type FullProduct } from "@/components/Shop/Product";

type PreviewSize = { size: string; quantity: number };

type PreviewVariant = {
  id: string;
  color: string;
  colorHex?: string;
  price: number;
  imageUrls: string[];
  sizes: PreviewSize[];
};

type Props = {
  title: string;
  description: string;
  brand: string;
  category: string;
  variants: PreviewVariant[];
};

/**
 * Renders the real /shop/[id] page component full-screen with the unsaved
 * form data, so the admin sees exactly how the product will look before
 * uploading. Nothing mounts until the button is clicked, so it costs nothing
 * while editing.
 */
export default function ProductPreview({
  title,
  description,
  brand,
  category,
  variants,
}: Props) {
  const [open, setOpen] = useState(false);

  // Close on Escape while open.
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const previewProduct: FullProduct = useMemo(() => {
    const now = new Date();
    return {
      id: "preview",
      title: title || "Untitled product",
      description: description || null,
      brand: brand || null,
      category: category || null,
      createdAt: now,
      updatedAt: now,
      createdById: "preview",
      deletedAt: null,
      deletedById: null,
      variants: variants.map((v) => ({
        id: v.id,
        productId: "preview",
        color: v.color || null,
        colorHex: v.colorHex ?? null,
        price: v.price,
        images: v.imageUrls,
        createdAt: now,
        updatedAt: now,
        sizes: v.sizes.map((s, i) => ({
          id: `${v.id}-size-${i}`,
          variantId: v.id,
          size: s.size,
          stock: s.quantity,
        })),
      })),
    };
  }, [title, description, brand, category, variants]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-muted-foreground hover:text-foreground border-border hover:border-foreground flex items-center gap-2 border px-6 py-3 text-xs tracking-[0.15em] uppercase transition-colors"
      >
        <Eye className="h-3.5 w-3.5" />
        Preview
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] overflow-y-auto bg-[#f5f4f0]">
          <div className="sticky top-0 z-[110] flex items-center justify-between bg-[#1a1a1a] px-4 py-2.5 text-white sm:px-6">
            <p className="text-[11px] tracking-[0.2em] uppercase">
              Preview — not saved yet
            </p>
            <button
              onClick={() => setOpen(false)}
              className="flex items-center gap-1.5 text-[11px] tracking-[0.15em] uppercase transition hover:opacity-70"
            >
              Exit preview
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <Product product={previewProduct} />
        </div>
      )}
    </>
  );
}
