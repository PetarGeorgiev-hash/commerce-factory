"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Minus, Plus } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCart, formatPrice, type CartItem } from "./CartContext";

export default function CartSheet() {
  const { items, subtotal, isOpen, setOpen, closeCart } = useCart();
  const router = useRouter();

  function goToCheckout() {
    closeCart();
    router.push("/checkout");
  }

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent
        side="right"
        className="w-full gap-0 border-[#e0deda] bg-white p-0 text-[#1a1a1a] sm:max-w-md"
      >
        <SheetHeader className="px-6 pt-6 pb-2">
          <SheetTitle className="text-[13px] font-semibold tracking-[0.25em] text-[#1a1a1a] uppercase">
            Bag
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6">
            <p className="text-sm tracking-[0.1em] text-[#888] uppercase">
              Your bag is empty
            </p>
            <button
              onClick={closeCart}
              className="bg-[#1a1a1a] px-8 py-3.5 text-[12px] font-semibold tracking-[0.2em] text-white uppercase transition hover:bg-[#333]"
            >
              Continue shopping
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-8 overflow-y-auto px-6 py-6">
              {items.map((item) => (
                <CartRow key={item.key} item={item} />
              ))}
            </div>

            <div className="border-t border-[#e0deda] px-6 py-5">
              <div className="mb-5 flex items-center justify-between">
                <span className="text-[13px] font-semibold tracking-[0.2em] uppercase">
                  Subtotal
                </span>
                <span className="text-[15px]">
                  {formatPrice(subtotal)} EUR
                </span>
              </div>
              <button
                onClick={goToCheckout}
                className="h-13 w-full bg-[#1a1a1a] py-4 text-[12px] font-semibold tracking-[0.25em] text-white uppercase transition hover:bg-[#333]"
              >
                Checkout
              </button>
              <button
                onClick={closeCart}
                className="mt-2.5 h-13 w-full bg-[#1a1a1a] py-4 text-[12px] font-semibold tracking-[0.25em] text-white uppercase transition hover:bg-[#333]"
              >
                Continue shopping
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function CartRow({ item }: { item: CartItem }) {
  const { removeItem, updateQty, updateSize } = useCart();
  const selectableSizes = item.availableSizes.filter(
    (s) => s.stock > 0 || s.id === item.sizeId,
  );

  return (
    <div className="flex gap-4">
      <div className="relative h-32 w-24 shrink-0 overflow-hidden bg-[#f5f4f0]">
        {item.image && (
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover"
            sizes="96px"
          />
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <p className="truncate text-[15px] tracking-wide">{item.title}</p>

        <div className="flex items-center gap-1.5 text-[13px] text-[#555]">
          {item.color && (
            <>
              <span>{item.color}</span>
              <span className="text-[#bbb]">/</span>
            </>
          )}
          {selectableSizes.length > 1 ? (
            <select
              value={item.sizeId}
              onChange={(e) => updateSize(item.key, e.target.value)}
              className="cursor-pointer border-b border-[#ccc] bg-transparent py-0.5 outline-none transition hover:border-[#1a1a1a]"
              aria-label="Change size"
            >
              {selectableSizes.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.size}
                </option>
              ))}
            </select>
          ) : (
            <span>{item.size}</span>
          )}
        </div>

        <div className="mt-1 flex items-center gap-3 text-[13px]">
          <span className="text-[#555]">Qty:</span>
          <button
            onClick={() => updateQty(item.key, item.qty - 1)}
            disabled={item.qty <= 1}
            className="flex h-6 w-6 items-center justify-center transition enabled:hover:bg-[#f0efec] disabled:cursor-not-allowed disabled:opacity-25"
            aria-label="Decrease quantity"
          >
            <Minus className="h-3 w-3" />
          </button>
          <span className="min-w-4 text-center tabular-nums">{item.qty}</span>
          <button
            onClick={() => updateQty(item.key, item.qty + 1)}
            disabled={item.qty >= item.maxStock}
            className="flex h-6 w-6 items-center justify-center transition enabled:hover:bg-[#f0efec] disabled:cursor-not-allowed disabled:opacity-25"
            aria-label="Increase quantity"
          >
            <Plus className="h-3 w-3" />
          </button>
        </div>
        {item.qty >= item.maxStock && (
          <p className="text-[11px] text-amber-600">
            Only {item.maxStock} in stock
          </p>
        )}
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1">
        <p className="text-[14px]">{formatPrice(item.price * item.qty)}</p>
        <button
          onClick={() => removeItem(item.key)}
          className="text-[13px] text-[#888] underline-offset-2 transition hover:text-[#1a1a1a] hover:underline"
        >
          Remove
        </button>
      </div>
    </div>
  );
}
