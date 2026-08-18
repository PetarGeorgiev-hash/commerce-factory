"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { api } from "@/trpc/react";
import { ROUTES } from "@/lib/constants/routes";
import { getProductCoverImage, getProductStartingPrice } from "@/lib/utils";

const MIN_QUERY_LENGTH = 2;
const MAX_RESULTS = 6;

const SearchBar = () => {
  const t = useTranslations("SearchBar");
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const enabled = open && query.trim().length >= MIN_QUERY_LENGTH;
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

  // Focus the field when the panel opens; lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function close() {
    setOpen(false);
    setQuery("");
  }

  function goTo(path: string) {
    close();
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
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        aria-label="Search"
        className="cursor-pointer"
      >
        <Search className="size-5" />
      </Button>

      {open && (
        <>
          {/* Backdrop */}
          <button
            aria-label="Close search"
            onClick={close}
            className="fixed inset-0 top-16 z-40 bg-black/30 backdrop-blur-sm"
          />

          {/* Panel drops from under the header */}
          <div className="bg-background absolute top-full right-0 left-0 z-50 border-b shadow-lg">
            <form
              onSubmit={handleSubmit}
              className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4 lg:px-8"
            >
              <Search className="text-muted-foreground size-5 shrink-0" />
              <input
                ref={inputRef}
                type="search"
                placeholder={t("placeholder")}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="text-foreground placeholder:text-muted-foreground/60 flex-1 bg-transparent text-base tracking-wide outline-none"
              />
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="text-muted-foreground hover:text-foreground shrink-0 transition"
              >
                <X className="size-5" />
              </button>
            </form>

            {query.trim().length >= MIN_QUERY_LENGTH && (
              <div className="mx-auto max-h-[60dvh] max-w-3xl overflow-y-auto px-4 pb-4 lg:px-8">
                {isLoading ? (
                  <p className="text-muted-foreground py-6 text-center text-sm">
                    Searching…
                  </p>
                ) : results.length === 0 ? (
                  <p className="text-muted-foreground py-6 text-center text-sm">
                    No results for “{query.trim()}”
                  </p>
                ) : (
                  <ul className="divide-border divide-y border-t">
                    {results.map((product) => {
                      const cover = getProductCoverImage(product);
                      const price = getProductStartingPrice(product);
                      return (
                        <li key={product.id}>
                          <button
                            type="button"
                            onClick={() => goTo(`${ROUTES.SHOP}/${product.id}`)}
                            className="hover:bg-muted flex w-full items-center gap-3 py-3 text-left transition"
                          >
                            <div className="bg-muted relative h-16 w-12 shrink-0 overflow-hidden">
                              {cover && (
                                <Image
                                  src={cover}
                                  alt={product.title}
                                  fill
                                  className="object-cover"
                                  sizes="48px"
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
                    <li>
                      <button
                        type="button"
                        onClick={handleSubmit}
                        className="text-muted-foreground hover:text-foreground w-full py-3 text-center text-xs tracking-[0.2em] uppercase transition"
                      >
                        View all results
                      </button>
                    </li>
                  </ul>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default SearchBar;
