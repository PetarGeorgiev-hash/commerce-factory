import React from "react";
import Link from "next/link";

const PageNavigation = () => {
  return (
    <nav className="hidden items-center space-x-6 md:flex">
      <Link
        href="/"
        className="hover:text-primary cursor-pointer text-sm font-medium transition-colors"
      >
        Home
      </Link>
      <Link
        href="/shop"
        className="hover:text-primary cursor-pointer text-sm font-medium transition-colors"
      >
        Shop
      </Link>
      <Link
        href="/categories"
        className="hover:text-primary cursor-pointer text-sm font-medium transition-colors"
      >
        Categories
      </Link>
      <Link
        href="/about"
        className="hover:text-primary cursor-pointer text-sm font-medium transition-colors"
      >
        About
      </Link>
      <Link
        href="/contact"
        className="hover:text-primary cursor-pointer text-sm font-medium transition-colors"
      >
        Contact
      </Link>
    </nav>
  );
};

export default PageNavigation;
