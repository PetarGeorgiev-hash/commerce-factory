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
import { UserMenu } from "./UserMenu";

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
      </DropdownMenuContent>
      <UserMenu />
    </DropdownMenu>
  );
};

export default UserDropdown;
