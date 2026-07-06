import type { Product } from "../types/types";

export type ShopFilters = {
  search: string;
  categories: string[];
  brands: string[];
  sizes: string[];
  colors: string[];
  priceFilter: string;
  inStockOnly: boolean;
};

export const EMPTY_FILTERS: ShopFilters = {
  search: "",
  categories: [],
  brands: [],
  sizes: [],
  colors: [],
  priceFilter: "all",
  inStockOnly: false,
};

/** Lowest variant price for a product, or 0 when it has no variants. */
function startingPrice(product: Product): number {
  const prices = product.variants.map((v) => v.price);
  return prices.length > 0 ? Math.min(...prices) : 0;
}

/** Distinct filter values present across the given products. */
export function getFacets(products: Product[]) {
  const brands = new Set<string>();
  const categories = new Set<string>();
  const sizes = new Set<string>();
  const colors = new Map<string, string | null>(); // color -> colorHex

  for (const product of products) {
    if (product.brand) brands.add(product.brand);
    if (product.category) categories.add(product.category);
    for (const variant of product.variants) {
      if (variant.color) colors.set(variant.color, variant.colorHex ?? null);
      for (const size of variant.sizes) sizes.add(size.size);
    }
  }

  return {
    brands: [...brands].sort(),
    categories: [...categories].sort(),
    sizes: [...sizes].sort(sizeComparator),
    colors: [...colors.entries()]
      .map(([color, colorHex]) => ({ color, colorHex }))
      .sort((a, b) => a.color.localeCompare(b.color)),
  };
}

/** Sort shoe sizes numerically when possible ("EU 42" < "EU 44"), else alphabetically. */
function sizeComparator(a: string, b: string): number {
  const na = parseFloat(a.replace(/[^\d.]/g, ""));
  const nb = parseFloat(b.replace(/[^\d.]/g, ""));
  if (!isNaN(na) && !isNaN(nb) && na !== nb) return na - nb;
  return a.localeCompare(b);
}

export function filterProducts(
  products: Product[],
  filters: ShopFilters,
): Product[] {
  const query = filters.search.trim().toLowerCase();

  return products.filter((product) => {
    const matchesSearch =
      !query ||
      product.title.toLowerCase().includes(query) ||
      (product.brand?.toLowerCase().includes(query) ?? false) ||
      (product.category?.toLowerCase().includes(query) ?? false) ||
      (product.description?.toLowerCase().includes(query) ?? false);

    const matchesCategory =
      filters.categories.length === 0 ||
      (product.category != null && filters.categories.includes(product.category));

    const matchesBrand =
      filters.brands.length === 0 ||
      (product.brand != null && filters.brands.includes(product.brand));

    const matchesColor =
      filters.colors.length === 0 ||
      product.variants.some(
        (v) => v.color != null && filters.colors.includes(v.color),
      );

    const matchesSize =
      filters.sizes.length === 0 ||
      product.variants.some((v) =>
        v.sizes.some((s) => filters.sizes.includes(s.size)),
      );

    const price = startingPrice(product);
    const matchesPrice =
      filters.priceFilter === "all" ||
      (filters.priceFilter === "under50" && price < 50) ||
      (filters.priceFilter === "50-100" && price >= 50 && price <= 100) ||
      (filters.priceFilter === "100-200" && price > 100 && price <= 200) ||
      (filters.priceFilter === "over200" && price > 200);

    const matchesStock =
      !filters.inStockOnly ||
      product.variants.some((v) => v.sizes.some((s) => s.stock > 0));

    return (
      matchesSearch &&
      matchesCategory &&
      matchesBrand &&
      matchesColor &&
      matchesSize &&
      matchesPrice &&
      matchesStock
    );
  });
}

export function sortProducts(
  products: Product[],
  sortOption: string,
): Product[] {
  return [...products].sort((a, b) => {
    if (sortOption === "priceAsc") {
      return startingPrice(a) - startingPrice(b);
    }
    if (sortOption === "priceDesc") {
      return startingPrice(b) - startingPrice(a);
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

export function activeFilterCount(filters: ShopFilters): number {
  return (
    filters.categories.length +
    filters.brands.length +
    filters.sizes.length +
    filters.colors.length +
    (filters.priceFilter !== "all" ? 1 : 0) +
    (filters.inStockOnly ? 1 : 0)
  );
}
