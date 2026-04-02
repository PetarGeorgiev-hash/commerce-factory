import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { signIn } from "next-auth/react";
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
        <DropdownMenuItem className="cursor-pointer">Sign In</DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="cursor-pointer"
        >
          Sign In with Google
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          My Orders
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">Settings</DropdownMenuItem>
      </DropdownMenuContent>
      <UserMenu />
    </DropdownMenu>
  );
};

export default UserDropdown;
