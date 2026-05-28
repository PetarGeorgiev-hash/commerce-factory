import type { ProductItem } from "../types/types";

export function filterProducts(
  products: ProductItem[],
  search: string,
  priceFilter: string,
): ProductItem[] {
  return products.filter((product) => {
    const query = search.trim().toLowerCase();
    const matchesSearch =
      (!query || product.title.toLowerCase().includes(query)) ??
      product.description?.toLowerCase().includes(query) ??
      product.images?.some((image) => image.toLowerCase().includes(query)) ??
      false;

    const price = typeof product.price === "number" ? product.price : 0;
    const matchesPrice =
      priceFilter === "all" ||
      (priceFilter === "under50" && price < 50) ||
      (priceFilter === "50-100" && price >= 50 && price <= 100) ||
      (priceFilter === "over100" && price > 100);

    return matchesSearch && matchesPrice;
  });
}

export function sortProducts(
  products: ProductItem[],
  sortOption: string,
): ProductItem[] {
  return [...products].sort((a, b) => {
    if (sortOption === "priceAsc") {
      return (a.price ?? 0) - (b.price ?? 0);
    }
    if (sortOption === "priceDesc") {
      return (b.price ?? 0) - (a.price ?? 0);
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}
