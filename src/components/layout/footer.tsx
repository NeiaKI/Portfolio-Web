"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const LINK_KEYS: { labelKey: string; href: string }[] = [
  { labelKey: "home",         href: "/" },
  { labelKey: "project",      href: "/project" },
  { labelKey: "blog",         href: "/blog" },
  { labelKey: "certificates", href: "/certificates" },
  { labelKey: "tools",        href: "/tools" },
  { labelKey: "changelog",    href: "/changelog" },
  { labelKey: "contact",      href: "/contact" },
];

const SOCIALS = [
  { label: "GitHub",      href: "https://github.com/NeiaKI" },
  { label: "LinkedIn",    href: "https://linkedin.com/in/febiyanto-rizki" },
  { label: "Instagram",   href: "https://instagram.com/nateeki" },
  { label: "X / Twitter", href: "https://x.com/nateeki" },
];

export function Footer() {
  const nav = useTranslations("nav");
  const t   = useTranslations("footer");

  return (
    <footer className="mt-16 border-t border-border/50 px-6 py-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        {/* Brand */}
        <div className="flex flex-col gap-1">
          <span className="font-bold text-foreground text-sm">nateeki</span>
          <span className="text-xs text-muted-foreground">{t("tagline")}</span>
          <span className="text-xs text-muted-foreground">{t("location")}</span>
        </div>

        {/* Nav links */}
        <div className="flex flex-col gap-1.5">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-1">
            {t("pages")}
          </p>
          {LINK_KEYS.map(({ labelKey, href }) => (
            <Link
              key={href}
              href={href}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors w-fit"
            >
              {nav(labelKey as Parameters<typeof nav>[0])}
            </Link>
          ))}
        </div>

        {/* Social links */}
        <div className="flex flex-col gap-1.5">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-1">
            {t("connect")}
          </p>
          {SOCIALS.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors w-fit"
            >
              {label}
            </a>
          ))}
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 border-t border-border/30 pt-5 text-[11px] text-muted-foreground/50 sm:flex-row sm:items-center sm:justify-between">
        <span>© {new Date().getFullYear()} Febiyanto Rizki Qurbandi</span>
        <div className="flex items-center gap-4">
          <Link href="/privacy" className="hover:text-foreground transition-colors">
            {t("privacy")}
          </Link>
          <Link href="/terms" className="hover:text-foreground transition-colors">
            {t("terms")}
          </Link>
          <span>{t("builtWith")}</span>
        </div>
      </div>
    </footer>
  );
}
