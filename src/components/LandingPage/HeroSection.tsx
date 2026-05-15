import { ROUTES } from "@/lib/constants/routes";
import { useTranslations } from "next-intl";
import Link from "next/link";
import React from "react";

export default function HeroSection() {
  const t = useTranslations("LandingPage.HeroSection");

  return (
    <section className="relative h-[92vh] overflow-hidden">
      {/* TODO add hero image */}
      {/* <Image
          src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1800&auto=format&fit=crop"
          alt="Hero"
          fill
          priority
          className="object-cover grayscale"
        /> */}

      <div className="absolute inset-0 bg-black/20" />

      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white">
        <p className="mb-5 text-[11px] tracking-[0.45em] uppercase opacity-80">
          {t("paragraph")}
        </p>

        <h1 className="max-w-5xl text-4xl font-light tracking-[0.15em] uppercase md:text-6xl">
          {t("header")}
        </h1>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link
            href={ROUTES.CATEGORIES}
            className="group flex h-14 min-w-55 items-center justify-center border border-white/40 bg-black/50 px-10 text-[12px] tracking-[0.35em] uppercase backdrop-blur-sm transition hover:bg-white hover:text-black"
          >
            {t("linkOne")}
          </Link>

          <Link
            href={ROUTES.SHOP}
            className="group flex h-14 min-w-55 items-center justify-center border border-white/40 bg-black/50 px-10 text-[12px] tracking-[0.35em] uppercase backdrop-blur-sm transition hover:bg-white hover:text-black"
          >
            {t("linkTwo")}
          </Link>
        </div>
      </div>
    </section>
  );
}
