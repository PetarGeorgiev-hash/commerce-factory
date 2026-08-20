"use client";

import React from "react";
import PageLogoComponent from "./PageLogoComponent";
import PageNavigation from "./PageNavigation";
import SearchBar from "./SearchBar";
import UserDropdown from "./UserDropdown";
import ShopingCartButton from "./ShopingCartButton";
import HamburgerMenu from "./HamburgerMenu";
import { ModeToggle } from "../theme-provider/theme-mode-toggle";
import { LayoutDashboard } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ROUTES } from "@/lib/constants/routes";
import LangSwitchButton from "../LangSwitchButton/LangSwitchButton";
import { useTranslations } from "next-intl";

const Navbar = () => {
  const { data: session, status } = useSession();
  const t = useTranslations("Navbar");

  const isAuthenticated = status === "authenticated" && session?.user;
  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <header className="bg-background supports-backdrop-filter:md:bg-background/70 sticky top-0 z-50 w-full transform-gpu border-b will-change-transform md:backdrop-blur">
      <div className="relative flex h-16 items-center justify-between px-4 lg:px-8">
        {/* Left — menu (mobile) + primary nav (desktop) */}
        <div className="flex flex-1 items-center gap-6">
          <HamburgerMenu
            isAuthenticated={!!isAuthenticated}
            isAdmin={isAdmin}
          />
          <PageNavigation />
        </div>

        {/* Center — wordmark */}
        <PageLogoComponent />

        {/* Right — actions */}
        <div className="flex flex-1 items-center justify-end gap-0.5 sm:gap-1">
          <SearchBar />
          {isAdmin && (
            <div className="hidden items-center gap-1 md:flex">
              <Link
                href={ROUTES.ADMIN}
                className="hover:text-primary flex items-center gap-1.5 px-2 text-[11px] font-medium tracking-[0.15em] uppercase transition-colors"
                title={t("admin")}
              >
                <LayoutDashboard className="size-4" />
                {t("admin")}
              </Link>
              <LangSwitchButton />
              <ModeToggle />
            </div>
          )}
          <ShopingCartButton />
          {/* Account — desktop only; mobile lives in the hamburger */}
          <div className="hidden md:flex">
            {isAuthenticated ? (
              <UserDropdown />
            ) : (
              <Link
                href={ROUTES.LOGIN}
                className="hover:text-primary ml-1 text-[11px] font-medium tracking-[0.15em] uppercase transition-colors"
              >
                {t("signIn")}
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
