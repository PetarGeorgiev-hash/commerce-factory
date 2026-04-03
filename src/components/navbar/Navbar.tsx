"use client";

import React from "react";
import PageLogoComponent from "./PageLogoComponent";
import PageNavigation from "./PageNavigation";
import SearchBar from "./SearchBar";
import UserDropdown from "./UserDropdown";
import ShopingCartButton from "./ShopingCartButton";
import HamburgerMenu from "./HamburgerMenu";
import { ModeToggle } from "../theme-provider/theme-mode-toggle";

const Navbar = () => {
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
          <UserDropdown />
          {/* Mobile Menu */}
          <HamburgerMenu />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
