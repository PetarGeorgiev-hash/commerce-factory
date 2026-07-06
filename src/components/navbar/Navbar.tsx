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
import LangSwitchButton from "../LangSwitchButton/LangSwitchButton";
import { useTranslations } from "next-intl";

const Navbar = () => {
  const { data: session, status } = useSession();
  const t = useTranslations("Navbar");

  const isAuthenticated = status === "authenticated" && session?.user;

  return (
    <header className="bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container flex min-h-16 flex-wrap items-center justify-between gap-y-2 px-4 py-2 md:h-16 md:flex-nowrap md:py-0">
        <PageLogoComponent />
        <PageNavigation />
        <SearchBar />
        {/* Right Side Actions */}
        <div className="flex items-center space-x-3">
          <LangSwitchButton />
          <ModeToggle />
          <ShopingCartButton />
          {isAuthenticated ? (
            <UserDropdown />
          ) : (
            <Button className="bg-primary text-primary-foreground hover:bg-primary/80">
              <Link href={ROUTES.LOGIN}>{t("signIn")}</Link>
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
