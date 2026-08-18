import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";

export const locales = ["en", "bg"];
export const defaultLocale = "en";

type MessageKeys = Record<string, string | Record<string, string>>;

export default getRequestConfig(async () => {
  const store = await cookies();
  const locale = store.get("locale")?.value ?? defaultLocale;
  if (!locales.includes(locale)) notFound();

  const imported = (await import(`../messages/${locale}.json`)) as {
    default: MessageKeys;
  };
  return {
    locale,
    messages: imported.default,
  };
});
