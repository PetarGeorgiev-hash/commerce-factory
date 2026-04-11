// src/components/LandingPage/SocialMediaFooter.tsx
import React from "react";
import Link from "next/link";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";

const SocialMediaFooter = () => {
  const socialLinks = [
    { href: "#", icon: FaFacebookF, label: "Facebook" },
    { href: "#", icon: FaTwitter, label: "Twitter" },
    { href: "#", icon: FaInstagram, label: "Instagram" },
    { href: "#", icon: FaLinkedinIn, label: "LinkedIn" },
    { href: "#", icon: FaYoutube, label: "YouTube" },
  ];

  return (
    <footer className="border-t border-white/10 bg-black py-8">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-sm text-slate-400">Follow us on social media</p>
          <div className="flex gap-6">
            {socialLinks.map(({ href, icon: Icon, label }) => (
              <Link
                key={label}
                href={href}
                aria-label={label}
                className="text-white/70 transition-colors hover:text-white"
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
