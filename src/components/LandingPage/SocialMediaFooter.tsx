// src/components/LandingPage/SocialMediaFooter.tsx
import React from "react";
import Link from "next/link";
import { socialLinks } from "@/lib/constants/socialMediaLinks";
import { getTranslations } from "next-intl/server";

const SocialMediaFooter = async () => {
  const t = await getTranslations("SocialMediaFooter");
  return (
    <footer className="border-t border-black/10 bg-white py-12 text-[#1a1a1a]">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center gap-5 text-center">
          <p className="text-[11px] tracking-[0.3em] text-black/50 uppercase">
            {t("followUs")}
          </p>
          <div className="flex gap-6">
            {socialLinks.map(({ href, icon: Icon, label }) => (
              <Link
                key={label}
                href={href}
                aria-label={label}
                className="text-black/60 transition-colors hover:text-black"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon size={22} />
              </Link>
            ))}
          </div>
          <p className="text-[11px] tracking-[0.15em] text-black/40 uppercase">
            © 2026 Name of Brand. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default SocialMediaFooter;
