import React from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

const ShopingCartButton = () => {
  return (
    <Button variant="ghost" size="icon" className="relative cursor-pointer">
      <ShoppingCart className="size-5" />
      {/* TODO make this dynamic based on the cart items count */}
      <span className="bg-primary text-primary-foreground absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full text-xs">
        3
      </span>
    </Button>
  );
};

export default ShopingCartButton;
