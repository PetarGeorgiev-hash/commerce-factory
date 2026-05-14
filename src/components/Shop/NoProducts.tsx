"use client";
import { useTranslations } from "next-intl";

export default function NoProducts() {
  const t = useTranslations("ShopPage.NoProducts");

  return (
    <div className="border-border bg-card rounded-3xl border p-8 text-center shadow-sm">
      <p className="text-xl font-semibold">{t("noProductsMatchFilters")}</p>
      <p className="text-muted-foreground mt-2 text-sm">
        {t("tryAdjustingSearchTerms")}
      </p>
    </div>
  );
}
