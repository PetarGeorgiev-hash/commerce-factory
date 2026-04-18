import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ROUTES } from "@/lib/constants/routes";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export default async function NotFound() {
  const t = await getTranslations("NotFound");

  return (
    <div className="container flex min-h-[80vh] items-center justify-center">
      <Card className="w-full max-w-md border-0 shadow-none">
        <div className="space-y-6 p-6 text-center">
          <p className="text-muted-foreground text-6xl font-bold">404</p>
          <h1 className="text-2xl font-semibold tracking-tight">
            {t("title")}
          </h1>
          <p className="text-muted-foreground">{t("description")}</p>
          <div className="flex flex-col gap-2 pt-4">
            <Button asChild className="bg-green-600">
              <Link href={ROUTES.HOME}>{t("homeButton")}</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={ROUTES.CONTACT}>{t("contactSupport")}</Link>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
