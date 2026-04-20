// src/components/LandingPage/SocialMediaFooter.tsx
import React from "react";
import Link from "next/link";
import { socialLinks } from "@/lib/constants/socialMediaLinks";
import { getTranslations } from "next-intl/server";

const SocialMediaFooter = async () => {
  const t = await getTranslations("SocialMediaFooter");
  return (
    <footer className="bg-background border-t border-white/10 py-8">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-sm text-slate-400">{t("followUs")}</p>
          <div className="flex gap-6">
            {socialLinks.map(({ href, icon: Icon, label }) => (
              <Link
                key={label}
                href={href}
                aria-label={label}
                className="transition-colors dark:text-white/70 dark:hover:text-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon size={24} />
              </Link>
            ))}
          </div>
          <p className="text-xs text-slate-500">
            © 2026 Commerce Factory. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default SocialMediaFooter;
