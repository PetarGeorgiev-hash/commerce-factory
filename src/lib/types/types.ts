export type ProductVariantSize = {
  id: string;
  variantId: string;
  size: string;
  stock: number;
};

export type ProductVariant = {
  id: string;
  productId: string;
  color: string | null;
  colorHex: string | null;
  price: number;
  images: string[];
  sizes: ProductVariantSize[];
  createdAt: Date;
  updatedAt: Date;
};

export type Product = {
  id: string;
  title: string;
  description: string | null;
  brand: string | null;
  category: string | null;
  createdAt: Date;
  updatedAt: Date;
  createdById: string;
  deletedAt: Date | null;
  deletedById: string | null;
  variants: ProductVariant[];
};

// Convenience helpers for common UI needs
export type ProductWithVariants = Product & {
  variants: ProductVariant[];
};
