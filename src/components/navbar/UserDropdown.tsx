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

const handleLogout = async () => {
  try {
    await signOut({ callbackUrl: ROUTES.HOME });
  } catch (error) {
    toast.error(
      "Logout failed. Please try again." +
        (error instanceof Error ? error.message : ""),
    );
    throw new Error("Logout failed");
  }
};

const UserDropdown = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="cursor-pointer">
        <Button variant="ghost" size="icon">
          <User className="size-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem className="cursor-pointer">
          <Link href={ROUTES.ACCOUNT}>Account</Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <Link href={ROUTES.ORDERS}>Orders</Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <Link href={ROUTES.SETTINGS}>Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="align-right cursor-pointer"
          onClick={handleLogout}
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
