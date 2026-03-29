import React from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

const HamburgerMenu = () => {
  return (
    <Button variant="ghost" size="icon" className="md:hidden">
      <Menu className="size-5" />
    </Button>
  );
};

export default HamburgerMenu;
