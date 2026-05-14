"use client";

import { useTranslations } from "next-intl";
import { Button } from "../ui/button";

function ShopPageError() {
  const t = useTranslations("ShopPage");

  return (
    <div className="border-destructive/30 bg-destructive/10 text-destructive rounded-3xl border p-8 text-center text-sm shadow-sm">
      <p>{t("error")}</p>
      <Button
        className="mt-4"
        variant="destructive"
        onClick={() => location.reload()}
      >
        {t("refresh")}
      </Button>
    </div>
  );
}

export default ShopPageError;
