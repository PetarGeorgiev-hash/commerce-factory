"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/lib/constants/routes";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

const UserDropdown = () => {
  const t = useTranslations("Navbar.UserDropdown");

  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: ROUTES.HOME });
    } catch (error) {
      toast.error(
        t("toastError") + (error instanceof Error ? error.message : ""),
      );
      throw new Error("Logout failed");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="cursor-pointer">
        <Button variant="ghost" size="icon">
          <User className="size-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem className="cursor-pointer">
          <Link href={ROUTES.ACCOUNT}>{t("account")}</Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <Link href={ROUTES.ORDERS}>{t("orders")}</Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <Link href={ROUTES.SETTINGS}>{t("settings")}</Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="align-right cursor-pointer"
          onClick={handleLogout}
        >
          {t("logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
