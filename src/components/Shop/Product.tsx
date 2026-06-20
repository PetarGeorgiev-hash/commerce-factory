"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, ChevronRight, Plus, Minus } from "lucide-react";
import type {
  Product,
  Product_Variant,
  Product_Variant_Size,
} from "generated/prisma";

type FullProduct = Product & {
  variants: (Product_Variant & { sizes: Product_Variant_Size[] })[];
};

export function Product({ product }: { product: FullProduct }) {
  const [activeVariantId, setActiveVariantId] = useState(
    product.variants[0]?.id ?? "",
  );
  const [activeSizeId, setActiveSizeId] = useState<string | null>(null);
  const [imageIndex, setImageIndex] = useState(0);
  const [qty, setQty] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const variant =
    product.variants.find((v) => v.id === activeVariantId) ??
    product.variants[0];

  const images = variant?.images ?? [];
  const sizes = variant?.sizes ?? [];
  const activeSize = sizes.find((s) => s.id === activeSizeId);
  const outOfStock = activeSize ? activeSize.stock === 0 : false;

  const nextImage = useCallback(() => {
    setImageIndex((i) => (i + 1) % Math.max(images.length, 1));
  }, [images.length]);

  const prevImage = useCallback(() => {
    setImageIndex(
      (i) => (i - 1 + Math.max(images.length, 1)) % Math.max(images.length, 1),
    );
  }, [images.length]);

  function handleVariantChange(id: string) {
    setActiveVariantId(id);
    setActiveSizeId(null);
    setImageIndex(0);
    setQty(1);
  }

  function handleAddToCart() {
    if (!activeSizeId || outOfStock) return;
    // TODO: wire up your cart logic here
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  }

  const currentImage = images[imageIndex];

  return (
    <div className="min-h-screen bg-[#f5f4f0] font-sans text-[#1a1a1a]">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-[1fr_480px]">
        <div className="relative bg-[#ebe9e4]">
          <div className="relative aspect-[4/5] w-full lg:sticky lg:top-0 lg:aspect-auto lg:h-screen">
            {currentImage ? (
              <Image
                src={currentImage}
                alt={`${product.title} — view ${imageIndex + 1}`}
                fill
                priority={imageIndex === 0}
                className="object-cover object-center transition-opacity duration-300"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <span className="text-sm tracking-widest text-[#999] uppercase">
                  No image
                </span>
              </div>
            )}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute top-1/2 left-3 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow backdrop-blur-sm transition hover:bg-white"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow backdrop-blur-sm transition hover:bg-white"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </>
            )}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setImageIndex(i)}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-200",
                      i === imageIndex
                        ? "w-6 bg-[#1a1a1a]"
                        : "w-1.5 bg-[#1a1a1a]/30",
                    )}
                    aria-label={`Image ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="hidden gap-2 p-3 lg:flex lg:flex-wrap">
              {images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setImageIndex(i)}
                  className={cn(
                    "relative h-20 w-16 overflow-hidden rounded transition",
                    i === imageIndex
                      ? "ring-2 ring-[#1a1a1a]"
                      : "opacity-60 hover:opacity-90",
                  )}
                >
                  <Image
                    src={src}
                    alt={`Thumbnail ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-col px-6 py-10 lg:overflow-y-auto lg:px-10 lg:py-16">
          <div className="mb-3 flex items-center gap-2">
            {product.brand && (
              <span className="text-[11px] font-semibold tracking-[0.2em] text-[#888] uppercase">
                {product.brand}
              </span>
            )}
            {product.brand && product.category && (
              <span className="text-[#ccc]">·</span>
            )}
            {product.category && (
              <span className="text-[11px] tracking-[0.2em] text-[#aaa] uppercase">
                {product.category}
              </span>
            )}
          </div>
          <h1 className="mb-4 text-[1.75rem] leading-tight font-light tracking-tight lg:text-[2.25rem]">
            {product.title}
          </h1>
          <p className="mb-8 text-lg font-medium tracking-wide">
            ${variant?.price.toFixed(2)}
          </p>
          <Separator className="mb-8 bg-[#e0deda]" />
          {product.variants.length > 1 && (
            <div className="mb-8">
              <p className="mb-3 text-[11px] font-semibold tracking-[0.18em] text-[#888] uppercase">
                Color
                {variant?.color && (
                  <span className="ml-2 font-normal tracking-normal text-[#1a1a1a] normal-case">
                    — {variant.color}
                  </span>
                )}
              </p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => handleVariantChange(v.id)}
                    title={v.color ?? ""}
                    className={cn(
                      "relative h-9 w-9 rounded-full border-2 transition",
                      activeVariantId === v.id
                        ? "scale-110 border-[#1a1a1a]"
                        : "border-transparent hover:border-[#aaa]",
                    )}
                    style={{ backgroundColor: v.colorHex ?? "#ccc" }}
                  >
                    {activeVariantId === v.id && (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <span className="h-2 w-2 rounded-full bg-white/60" />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="mb-8">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[11px] font-semibold tracking-[0.18em] text-[#888] uppercase">
                Size
                {activeSize && (
                  <span className="ml-2 font-normal tracking-normal text-[#1a1a1a] normal-case">
                    — {activeSize.size}
                  </span>
                )}
              </p>
              <button className="text-[11px] text-[#888] underline underline-offset-2 transition hover:text-[#1a1a1a]">
                Size guide
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {sizes.map((s) => {
                const sold = s.stock === 0;
                return (
                  <button
                    key={s.id}
                    disabled={sold}
                    onClick={() => setActiveSizeId(s.id)}
                    className={cn(
                      "relative rounded border py-3 text-[13px] tracking-wide transition select-none",
                      sold
                        ? "cursor-not-allowed border-[#e0deda] text-[#ccc] line-through"
                        : activeSizeId === s.id
                          ? "border-[#1a1a1a] bg-[#1a1a1a] text-white"
                          : "border-[#d5d3ce] bg-transparent text-[#1a1a1a] hover:border-[#1a1a1a]",
                    )}
                  >
                    {s.size}
                    {!sold && s.stock <= 3 && (
                      <span className="absolute -top-1.5 -right-1.5 flex h-3 w-3 items-center justify-center rounded-full bg-amber-400" />
                    )}
                  </button>
                );
              })}
            </div>
            {sizes.some((s) => !s.stock || s.stock <= 3) && (
              <p className="mt-2 flex items-center gap-1.5 text-[11px] text-amber-600">
                <span className="inline-block h-2 w-2 rounded-full bg-amber-400" />
                Low stock on some sizes
              </p>
            )}
          </div>

          {/* ── Quantity ── */}
          <div className="mb-8">
            <p className="mb-3 text-[11px] font-semibold tracking-[0.18em] text-[#888] uppercase">
              Quantity
            </p>
            <div className="flex w-36 items-center rounded border border-[#d5d3ce]">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="flex h-11 w-11 items-center justify-center transition hover:bg-[#e8e6e0]"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="flex-1 text-center text-sm tabular-nums">
                {qty}
              </span>
              <button
                onClick={() =>
                  setQty((q) => Math.min(q + 1, activeSize?.stock ?? 99))
                }
                className="flex h-11 w-11 items-center justify-center transition hover:bg-[#e8e6e0]"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* ── Add to cart ── */}
          <Button
            onClick={handleAddToCart}
            disabled={!activeSizeId || outOfStock}
            className={cn(
              "h-14 w-full rounded-none text-[13px] font-semibold tracking-[0.2em] uppercase transition-all duration-200",
              addedToCart
                ? "bg-green-700 text-white hover:bg-green-700"
                : "bg-[#1a1a1a] text-white hover:bg-[#333]",
            )}
          >
            {outOfStock
              ? "Out of Stock"
              : !activeSizeId
                ? "Select a Size"
                : addedToCart
                  ? "Added ✓"
                  : "Add to Cart"}
          </Button>

          {!activeSizeId && !outOfStock && (
            <p className="mt-2 text-center text-[11px] text-[#aaa]">
              Please select a size to continue
            </p>
          )}

          <Separator className="my-10 bg-[#e0deda]" />

          {/* ── Description ── */}
          {product.description && (
            <div className="mb-10">
              <p className="mb-3 text-[11px] font-semibold tracking-[0.18em] text-[#888] uppercase">
                Description
              </p>
              <p className="text-[15px] leading-relaxed text-[#444]">
                {product.description}
              </p>
            </div>
          )}

          {/* ── Details accordion placeholder ── */}
          <div className="space-y-0 border-t border-[#e0deda]">
            {["Shipping & Returns", "Care Instructions"].map((label) => (
              <details key={label} className="group border-b border-[#e0deda]">
                <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-[13px] tracking-[0.15em] text-[#666] uppercase">
                  {label}
                  <span className="text-lg leading-none transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="pb-4 text-[13px] leading-relaxed text-[#888]">
                  Details coming soon.
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
