import React from "react";
import Link from "next/link";
import { ROUTES } from "@/lib/constants/routes";

const PageNavigation = () => {
  return (
    <nav className="hidden items-center space-x-6 md:flex">
      <Link
        href={ROUTES.HOME}
        className="hover:text-primary cursor-pointer text-sm font-medium transition-colors"
      >
        Home
      </Link>
      <Link
        href={ROUTES.SHOP}
        className="hover:text-primary cursor-pointer text-sm font-medium transition-colors"
      >
        Shop
      </Link>
      <Link
        href={ROUTES.CATEGORIES}
        className="hover:text-primary cursor-pointer text-sm font-medium transition-colors"
      >
        Categories
      </Link>
      <Link
        href={ROUTES.ABOUT}
        className="hover:text-primary cursor-pointer text-sm font-medium transition-colors"
      >
        About
      </Link>
      <Link
        href={ROUTES.CONTACT}
        className="hover:text-primary cursor-pointer text-sm font-medium transition-colors"
      >
        Contact
      </Link>
    </nav>
  );
};

export default PageNavigation;
