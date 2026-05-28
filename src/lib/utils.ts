import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Product, ProductVariant } from "./types/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function uploadToBlob(file: File, folder = "products") {
  const MAX_MB = 15;
  if (file.size > MAX_MB * 1024 * 1024) {
    throw new Error(`${file.name} exceeds ${MAX_MB}MB limit`);
  }

  const ext = file.name.split(".").pop()?.toLowerCase();
  const uniqueName = `${folder}/${crypto.randomUUID()}.${ext}`;

  const res = await fetch(
    `/api/blob-upload?filename=${encodeURIComponent(uniqueName)}`,
    { method: "POST", body: file },
  );

  if (!res.ok) {
    const status = res.status;
    if (status === 413) throw new Error(`${file.name} is too large (max 5MB)`);
    if (status === 415)
      throw new Error(`${file.name} has an unsupported file type`);
    if (status === 401) throw new Error("Unauthorized");
    throw new Error(`Upload failed for ${file.name}`);
  }

  return res.json() as Promise<{ url: string }>;
}

export function getProductCoverImage(product: Product): string | null {
  return product.variants[0]?.images[0] ?? null;
}

export function getProductStartingPrice(product: Product): number | null {
  const prices = product.variants.map((v) => v.price);
  return prices.length > 0 ? Math.min(...prices) : null;
}

export function getProductColors(product: Product) {
  return product.variants
    .filter((v) => v.color)
    .map((v) => ({ color: v.color!, colorHex: v.colorHex ?? null }));
}

export function isProductInStock(product: Product): boolean {
  return product.variants.some((v) => v.sizes.some((s) => s.stock > 0));
}

export function getVariantAvailableSizes(variant: ProductVariant) {
  return variant.sizes.filter((s) => s.stock > 0);
}
