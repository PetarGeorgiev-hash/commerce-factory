import Image from "next/image";
import Link from "next/link";
import type { Product, ProductVariant } from "@/lib/types/types";
import { getProductColors, getProductStartingPrice } from "@/lib/utils";

export default function ProductCard({
  product,
  variant,
}: {
  product: Product;
  /** When set, the card represents this specific colorway. */
  variant?: ProductVariant;
}) {
  const activeVariant = variant ?? product.variants[0];
  const coverImage = activeVariant?.images[0] ?? null;
  const hoverImage = activeVariant?.images[1] ?? null; // ← second image
  const startingPrice = variant
    ? variant.price
    : getProductStartingPrice(product);
  const colors = variant ? [] : getProductColors(product);
  const href = variant
    ? `/shop/${product.id}?variant=${variant.id}`
    : `/shop/${product.id}`;

  return (
    <Link href={href} className="group block">
      <div className="bg-muted relative aspect-[3/4] w-full overflow-hidden">
        {coverImage ? (
          <>
            <Image
              src={coverImage}
              alt={product.title}
              fill
              className={`object-cover transition-opacity duration-500 ${
                hoverImage ? "group-hover:opacity-0" : "group-hover:scale-105"
              }`}
              sizes="(max-width: 640px) 50vw, 33vw"
            />
            {hoverImage && (
              <Image
                src={hoverImage}
                alt={product.title}
                fill
                className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                sizes="(max-width: 640px) 50vw, 33vw"
              />
            )}
          </>
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-muted-foreground/40 text-xs tracking-widest uppercase">
              No image
            </span>
          </div>
        )}
      </div>
      <div className="mt-3 space-y-1 px-0.5">
        {product.brand && (
          <p className="text-muted-foreground text-[10px] tracking-widest uppercase">
            {product.brand}
          </p>
        )}
        <p className="text-foreground text-sm">{product.title}</p>
        {variant?.color && (
          <p className="text-muted-foreground flex items-center gap-1.5 text-[11px]">
            {variant.colorHex && (
              <span
                className="border-border h-2.5 w-2.5 rounded-full border"
                style={{ backgroundColor: variant.colorHex }}
              />
            )}
            {variant.color}
          </p>
        )}
        <div className="flex items-center justify-between">
          {startingPrice != null && (
            <p className="text-muted-foreground text-sm">
              €
              {startingPrice.toLocaleString("de-DE", {
                minimumFractionDigits: 2,
              })}
            </p>
          )}
          {colors.length > 1 && (
            <div className="flex gap-1">
              {colors.slice(0, 4).map((c, i) => (
                <span
                  key={i}
                  title={c.color}
                  className="border-border h-3 w-3 rounded-full border"
                  style={{ backgroundColor: c.colorHex ?? "#888" }}
                />
              ))}
              {colors.length > 4 && (
                <span className="text-muted-foreground text-[10px]">
                  +{colors.length - 4}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
