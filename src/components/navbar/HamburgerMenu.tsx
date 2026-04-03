"use client";

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
import { ROUTES } from "@/lib/constants/routes";

const HamburgerMenu = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="cursor-pointer md:hidden"
        >
          <Menu className="size-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="cursor-pointer md:hidden">
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link
            href={ROUTES.SHOP}
            className="flex cursor-pointer items-center gap-2"
          >
            Shop
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link
            href={ROUTES.CATEGORIES}
            className="flex cursor-pointer items-center gap-2"
          >
            Categories
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link
            href={ROUTES.ABOUT}
            className="hover:text-primary cursor-pointer text-sm font-medium transition-colors"
          >
            About
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link
            href={ROUTES.CONTACT}
            className="hover:text-primary cursor-pointer text-sm font-medium transition-colors"
          >
            Contact
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default HamburgerMenu;
