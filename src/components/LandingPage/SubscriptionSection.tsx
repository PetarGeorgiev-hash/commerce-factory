'use client";';

import { useTranslations } from "next-intl";

export default function SubscriptionSection() {
  const t = useTranslations("LandingPage.SubscriptionSection");

  return (
    <section className="border-t border-black/10 px-6 py-24 lg:px-12">
      <div className="mx-auto max-w-3xl text-center">
        <p className="mb-4 text-[11px] tracking-[0.4em] text-black/50 uppercase">
          {t("paragraph")}
        </p>

        <h3 className="text-4xl font-light tracking-[0.12em] uppercase">
          {t("header")}
        </h3>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <input
            type="email"
            placeholder={t("emailPlaceholder")}
            className="h-14 flex-1 border border-black/15 bg-transparent px-5 text-sm outline-none placeholder:text-black/40 focus:border-black"
          />

          <button className="h-14 border border-black bg-black px-10 text-[12px] tracking-[0.35em] text-white uppercase transition hover:bg-transparent hover:text-black">
            {t("subscribeButton")}
          </button>
        </div>
      </div>
    </section>
  );
}
