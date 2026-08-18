import { ROUTES } from "@/lib/constants/routes";
import { useTranslations } from "next-intl";
import Link from "next/link";
import React from "react";

export default function HeroSection() {
  const t = useTranslations("LandingPage.HeroSection");

  return (
    <section className="relative flex min-h-[calc(100svh-4rem)] items-center justify-center overflow-hidden bg-[#e7e5e0]">
      {/* TODO: drop in a full-bleed hero image here (object-cover). */}
      {/* <Image src="..." alt="Hero" fill priority className="object-cover" /> */}

      <div className="relative z-10 flex flex-col items-center px-6 text-center text-[#1a1a1a]">
        <p className="mb-5 text-[10px] tracking-[0.4em] uppercase opacity-70 sm:text-[11px] sm:tracking-[0.45em]">
          {t("paragraph")}
        </p>

        <h1 className="max-w-4xl text-3xl leading-tight font-light tracking-[0.12em] uppercase sm:text-5xl md:text-6xl">
          {t("header")}
        </h1>

        <div className="mt-10 flex w-full max-w-md flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4">
          <Link
            href={ROUTES.CATEGORIES}
            className="flex h-13 items-center justify-center border border-[#1a1a1a] px-10 text-[11px] tracking-[0.3em] uppercase transition hover:bg-[#1a1a1a] hover:text-white sm:min-w-52"
          >
            {t("linkOne")}
          </Link>

          <Link
            href={ROUTES.SHOP}
            className="flex h-13 items-center justify-center bg-[#1a1a1a] px-10 text-[11px] tracking-[0.3em] text-white uppercase transition hover:bg-[#333] sm:min-w-52"
          >
            {t("linkTwo")}
          </Link>
        </div>
      </div>
    </section>
  );
}
