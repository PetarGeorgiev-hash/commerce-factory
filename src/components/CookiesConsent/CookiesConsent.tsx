"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Cookie, Settings } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ROUTES } from "@/lib/constants/routes";

const COOKIE_CONSENT_KEY = "wealthsync-cookie-consent";

export function CookieConsentDialog() {
  const t = useTranslations("CookieConsentDialog");

  const [showDialog, setShowDialog] = useState<boolean | null>(null);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    setShowDialog(!consent);
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    setShowDialog(false);
  };

  const handleAcceptNecessary = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "necessary-only");
    setShowDialog(false);
  };

  if (showDialog === null) return null;

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent className="mt-55 max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Cookie className="h-5 w-5 text-amber-600" />
            {t("title")}
          </DialogTitle>
          <DialogDescription className="text-left">
            {t("description")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 text-sm">
          <div>
            <h4 className="font-medium">{t("essentialHeader")}</h4>
            <p className="text-muted-foreground text-xs">
              {t("requiredParagraph")}
            </p>
          </div>
          <div>
            <h4 className="font-medium">{t("analyticsHeader")}</h4>
            <p className="text-muted-foreground text-xs">
              {t("analyticsParagraph")}
            </p>
          </div>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button
            onClick={handleAcceptAll}
            className="w-full cursor-pointer bg-green-700 hover:bg-green-800 dark:hover:text-white"
          >
            {t("acceptAll")}
          </Button>
          <div className="flex w-full gap-2">
            <Button
              variant="outline"
              onClick={handleAcceptNecessary}
              className="flex-1 cursor-pointer"
            >
              {t("necessary")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              asChild
              className="cursor-pointer"
            >
              <Link href={ROUTES.SETTINGS}>
                <Settings className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
