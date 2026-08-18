"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type CartSizeOption = { id: string; size: string; stock: number };

export type CartItem = {
  /** variantId:sizeId — one row per variant+size combination */
  key: string;
  productId: string;
  variantId: string;
  sizeId: string;
  title: string;
  color: string | null;
  size: string;
  price: number;
  image: string | null;
  qty: number;
  maxStock: number;
  availableSizes: CartSizeOption[];
};

type NewCartItem = Omit<CartItem, "key" | "qty">;

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  setOpen: (open: boolean) => void;
  addItem: (item: NewCartItem, qty?: number) => void;
  removeItem: (key: string) => void;
  updateQty: (key: string, qty: number) => void;
  updateSize: (key: string, sizeId: string) => void;
  removeBySizeId: (sizeId: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "cf-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Restore the cart from localStorage after mount (avoids SSR mismatch).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw) as CartItem[]);
    } catch {
      // corrupted storage — start fresh
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // storage full/unavailable — cart still works in memory
    }
  }, [items, hydrated]);

  const addItem = useCallback((item: NewCartItem, qty = 1) => {
    const key = `${item.variantId}:${item.sizeId}`;
    setItems((prev) => {
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) =>
          i.key === key
            ? { ...i, qty: Math.min(i.qty + qty, i.maxStock) }
            : i,
        );
      }
      return [...prev, { ...item, key, qty: Math.min(qty, item.maxStock) }];
    });
  }, []);

  const removeItem = useCallback((key: string) => {
    setItems((prev) => prev.filter((i) => i.key !== key));
  }, []);

  const updateQty = useCallback((key: string, qty: number) => {
    setItems((prev) =>
      prev.map((i) =>
        i.key === key
          ? { ...i, qty: Math.min(Math.max(1, qty), i.maxStock) }
          : i,
      ),
    );
  }, []);

  const updateSize = useCallback((key: string, sizeId: string) => {
    setItems((prev) => {
      const item = prev.find((i) => i.key === key);
      if (!item || item.sizeId === sizeId) return prev;
      const next = item.availableSizes.find((s) => s.id === sizeId);
      if (!next || next.stock === 0) return prev;

      const newKey = `${item.variantId}:${next.id}`;
      const duplicate = prev.find((i) => i.key === newKey);
      const moved: CartItem = {
        ...item,
        key: newKey,
        sizeId: next.id,
        size: next.size,
        maxStock: next.stock,
        qty: Math.min(item.qty + (duplicate?.qty ?? 0), next.stock),
      };
      return prev
        .filter((i) => i.key !== key && i.key !== newKey)
        .concat(moved);
    });
  }, []);

  const removeBySizeId = useCallback((sizeId: string) => {
    setItems((prev) => prev.filter((i) => i.sizeId !== sizeId));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const openCart = useCallback(() => setOpen(true), []);
  const closeCart = useCallback(() => setOpen(false), []);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((sum, i) => sum + i.qty, 0);
    const subtotal = items.reduce((sum, i) => sum + i.qty * i.price, 0);
    return {
      items,
      count,
      subtotal,
      isOpen,
      openCart,
      closeCart,
      setOpen,
      addItem,
      removeItem,
      updateQty,
      updateSize,
      removeBySizeId,
      clearCart,
    };
  }, [
    items,
    isOpen,
    openCart,
    closeCart,
    addItem,
    removeItem,
    updateQty,
    updateSize,
    removeBySizeId,
    clearCart,
  ]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export function formatPrice(value: number) {
  return `€${value.toLocaleString("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
