"use client";

import React from "react";
import Link from "next/link";
import { ROUTES } from "@/lib/constants/routes";
import { useTranslations } from "next-intl";

const PageNavigation = () => {
  const t = useTranslations("Navbar");
  return (
    <nav className="hidden items-center space-x-6 md:flex">
      <Link
        href={ROUTES.SHOP}
        className="hover:text-primary cursor-pointer text-sm font-medium transition-colors"
      >
        {t("shop")}
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
