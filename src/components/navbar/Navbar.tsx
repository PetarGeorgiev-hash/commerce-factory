"use client";

import React from "react";
import PageLogoComponent from "./PageLogoComponent";
import PageNavigation from "./PageNavigation";
import SearchBar from "./SearchBar";
import UserDropdown from "./UserDropdown";
import ShopingCartButton from "./ShopingCartButton";
import HamburgerMenu from "./HamburgerMenu";
import { ModeToggle } from "../theme-provider/theme-mode-toggle";
import { useSession } from "next-auth/react";
import { Button } from "../ui/button";
import Link from "next/link";
import { ROUTES } from "@/lib/constants/routes";

const Navbar = () => {
  const { data: session, status } = useSession();
  
  const isAuthenticated = status === "authenticated" && session?.user;
  console.log('session', session);
  console.log('status', status);
  
  return (
    <header className="bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container flex h-16 items-center justify-between px-4">
        <PageLogoComponent />
        <PageNavigation />
        <SearchBar />
        {/* Right Side Actions */}
        <div className="flex items-center space-x-3">
          <ModeToggle />
          <ShopingCartButton />
          {/* TODO only show UserDropdown if we have a user, otherwise show sign in button */}
          {isAuthenticated ? (
            <UserDropdown />
          ) : (
            <Button className="bg-primary text-primary-foreground hover:bg-primary/80">
              <Link href={ROUTES.REGISTER}>Sign In</Link>
            </Button>
          )}
          {/* Mobile Menu */}
          <HamburgerMenu />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
