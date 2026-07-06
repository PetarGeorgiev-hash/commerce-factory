"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { api } from "@/trpc/react";
import { ROUTES } from "@/lib/constants/routes";
import { getProductCoverImage, getProductStartingPrice } from "@/lib/utils";

const MIN_QUERY_LENGTH = 2;
const MAX_RESULTS = 6;

const SearchBar = () => {
  const t = useTranslations("SearchBar");
  const router = useRouter();
  const containerRef = useRef<HTMLFormElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const enabled = query.trim().length >= MIN_QUERY_LENGTH;
  const { data: products, isLoading } = api.product.getAll.useQuery(undefined, {
    enabled,
    staleTime: 60_000,
  });

  const results = useMemo(() => {
    if (!enabled || !products) return [];
    const q = query.trim().toLowerCase();
    return products
      .filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.brand?.toLowerCase().includes(q) ?? false) ||
          (p.category?.toLowerCase().includes(q) ?? false),
      )
      .slice(0, MAX_RESULTS);
  }, [enabled, products, query]);

  // Close the dropdown when clicking outside of it.
  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  function goTo(path: string) {
    setOpen(false);
    setQuery("");
    router.push(path);
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmed = query.trim();
    goTo(
      trimmed
        ? `${ROUTES.SHOP}?search=${encodeURIComponent(trimmed)}`
        : ROUTES.SHOP,
    );
  }

  return (
    <form
      ref={containerRef}
      onSubmit={handleSubmit}
      className="relative order-last w-full basis-full md:order-none md:mx-6 md:max-w-sm md:flex-1 md:basis-auto"
    >
      <div className="relative w-full">
        <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2 transform" />
        <Input
          type="search"
          placeholder={t("placeholder")}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(event.target.value.trim().length >= MIN_QUERY_LENGTH);
          }}
          onFocus={() => setOpen(enabled)}
          onKeyDown={(event) => {
            if (event.key === "Escape") setOpen(false);
          }}
          className="pl-10"
        />
      </div>

      {open && (
        <div className="border-border bg-background absolute top-full right-0 left-0 z-50 mt-2 overflow-hidden rounded-md border shadow-lg">
          {isLoading ? (
            <p className="text-muted-foreground px-4 py-6 text-center text-sm">
              {t("placeholder")}
            </p>
          ) : results.length === 0 ? (
            <p className="text-muted-foreground px-4 py-6 text-center text-sm">
              No results for “{query.trim()}”
            </p>
          ) : (
            <ul>
              {results.map((product) => {
                const cover = getProductCoverImage(product);
                const price = getProductStartingPrice(product);
                return (
                  <li key={product.id}>
                    <button
                      type="button"
                      onClick={() => goTo(`${ROUTES.SHOP}/${product.id}`)}
                      className="hover:bg-muted flex w-full items-center gap-3 px-3 py-2.5 text-left transition"
                    >
                      <div className="bg-muted relative h-14 w-11 shrink-0 overflow-hidden rounded">
                        {cover && (
                          <Image
                            src={cover}
                            alt={product.title}
                            fill
                            className="object-cover"
                            sizes="44px"
                          />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        {product.brand && (
                          <p className="text-muted-foreground truncate text-[10px] tracking-widest uppercase">
                            {product.brand}
                          </p>
                        )}
                        <p className="truncate text-sm">{product.title}</p>
                      </div>
                      {price != null && (
                        <p className="text-muted-foreground shrink-0 text-sm">
                          €
                          {price.toLocaleString("de-DE", {
                            minimumFractionDigits: 2,
                          })}
                        </p>
                      )}
                    </button>
                  </li>
                );
              })}
              <li className="border-border border-t">
                <button
                  type="submit"
                  className="text-muted-foreground hover:text-foreground w-full px-3 py-2.5 text-center text-xs tracking-[0.15em] uppercase transition"
                >
                  View all results
                </button>
              </li>
            </ul>
          )}
        </div>
      )}
    </form>
  );
};

export default SearchBar;
