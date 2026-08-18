"use client";

import { useTranslations } from "next-intl";

export default function SubscriptionSection() {
  const t = useTranslations("LandingPage.SubscriptionSection");

  return (
    <section className="border-t border-black/10 px-6 py-16 sm:py-24 lg:px-12">
      <div className="mx-auto max-w-3xl text-center">
        <p className="mb-4 text-[10px] tracking-[0.4em] text-black/50 uppercase sm:text-[11px]">
          {t("paragraph")}
        </p>

        <h3 className="text-2xl font-light tracking-[0.12em] uppercase sm:text-4xl">
          {t("header")}
        </h3>

        <form className="mx-auto mt-10 flex w-full max-w-lg flex-col gap-3 sm:flex-row sm:gap-4">
          <input
            type="email"
            placeholder={t("emailPlaceholder")}
            className="h-14 w-full border border-black/15 bg-transparent px-5 text-base outline-none placeholder:text-black/40 focus:border-black sm:h-13 sm:flex-1 sm:text-sm"
          />
          <button
            type="submit"
            className="h-14 w-full border border-black bg-black px-10 text-[12px] tracking-[0.3em] text-white uppercase transition hover:bg-transparent hover:text-black sm:h-13 sm:w-auto sm:text-[11px]"
          >
            {t("subscribeButton")}
          </button>
        </form>
      </div>
    </section>
  );
}
