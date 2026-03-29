import React from "react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

const HamburgerMenu = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="size-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="md:hidden">
        <DropdownMenuItem asChild>
          <Link href="/shop" className="flex items-center gap-2">
            Shop
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/categories" className="flex items-center gap-2">
            Categories
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href="/about"
            className="hover:text-primary text-sm font-medium transition-colors"
          >
            About
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href="/contact"
            className="hover:text-primary text-sm font-medium transition-colors"
          >
            Contact
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default HamburgerMenu;
