"use client";

import React from "react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { ROUTES } from "@/lib/constants/routes";
import { useTranslations } from "next-intl";
import { signOut, useSession } from "next-auth/react";
import { toast } from "sonner";

const HamburgerMenu = ({
  isAuthenticated,
  isAdmin,
}: {
  isAuthenticated: boolean;
  isAdmin: boolean;
}) => {
  const t = useTranslations("Navbar");
  const tUser = useTranslations("Navbar.UserDropdown");

  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: ROUTES.HOME });
    } catch (error) {
      toast.error(
        tUser("toastError") + (error instanceof Error ? error.message : ""),
      );
    }
  };

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
      <DropdownMenuContent align="start" className="w-48 md:hidden">
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href={ROUTES.SHOP}>{t("shop")}</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href={ROUTES.CONTACT}>{t("contact")}</Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {isAuthenticated ? (
          <>
            {isAdmin && (
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href={ROUTES.ADMIN}>{t("admin")}</Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href={ROUTES.ACCOUNT}>{tUser("account")}</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href={ROUTES.ORDERS}>{tUser("orders")}</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href={ROUTES.SETTINGS}>{tUser("settings")}</Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
              {tUser("logout")}
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href={ROUTES.LOGIN}>{t("signIn")}</Link>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default HamburgerMenu;
