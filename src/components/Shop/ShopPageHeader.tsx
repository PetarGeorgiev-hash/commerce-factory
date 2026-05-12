"use client";
import { useTranslations } from "next-intl";

function ShopPageHeader() {
  const t = useTranslations("ShopPage.Header");

  return (
    <div className="border-border bg-card space-y-3 rounded-3xl border p-6 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-muted-foreground text-sm tracking-[0.2em] uppercase">
            {t("shop")}
          </p>
          <h1 className="text-3xl font-semibold">{t("title")}</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl text-sm">
          {t("description")}
        </p>
      </div>
    </div>
  );
}

export default ShopPageHeader;
