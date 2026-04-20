"use client";

import React from "react";
import Link from "next/link";
import { ROUTES } from "@/lib/constants/routes";
// import { getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";

const PageNavigation = () => {
  const t = useTranslations("Navbar");
  return (
    <nav className="hidden items-center space-x-6 md:flex">
      <Link
        href={ROUTES.HOME}
        className="hover:text-primary cursor-pointer text-sm font-medium transition-colors"
      >
        {t("home")}
      </Link>
      <Link
        href={ROUTES.SHOP}
        className="hover:text-primary cursor-pointer text-sm font-medium transition-colors"
      >
        {t("shop")}
      </Link>
      <Link
        href={ROUTES.CATEGORIES}
        className="hover:text-primary cursor-pointer text-sm font-medium transition-colors"
      >
        {t("categories")}
      </Link>
      <Link
        href={ROUTES.ABOUT}
        className="hover:text-primary cursor-pointer text-sm font-medium transition-colors"
      >
        {t("about")}
      </Link>
      <Link
        href={ROUTES.CONTACT}
        className="hover:text-primary cursor-pointer text-sm font-medium transition-colors"
      >
        {t("contact")}
      </Link>
    </nav>
  );
};

export default PageNavigation;
