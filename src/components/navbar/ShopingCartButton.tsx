"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/components/Cart/CartContext";

const ShopingCartButton = () => {
  const { count, openCart } = useCart();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative cursor-pointer"
      onClick={openCart}
      aria-label="Open bag"
    >
      <ShoppingCart className="size-5" />
      {count > 0 && (
        <span className="bg-primary text-primary-foreground absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full text-xs">
          {count}
        </span>
      )}
    </Button>
  );
};

export default ShopingCartButton;
