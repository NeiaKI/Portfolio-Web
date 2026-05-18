"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { SOCIAL_LINKS } from "@/lib/social-links";

export function HeroSection() {
  const t = useTranslations("home");
  const roles: string[] = t.raw("roles") as string[];

  const [roleIdx, setRoleIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = roles[roleIdx];
    let timeout: ReturnType<typeof setTimeout>;
    if (!deleting && displayed.length < current.length) {
      timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 80);
    } else if (!deleting && displayed.length === current.length) {
      timeout = setTimeout(() => setDeleting(true), 2000);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 40);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setRoleIdx((prev) => (prev + 1) % roles.length);
    }
    return () => clearTimeout(timeout);
  }, [displayed, deleting, roleIdx, roles]);

  return (
    <section className="flex flex-col gap-5 py-6">
      {/* Avatar — visible only on mobile (sidebar shows it on desktop) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "backOut" }}
        className="flex lg:hidden"
      >
        <div className="relative h-16 w-16">
          {/* Animated gradient ring */}
          <div className="absolute inset-0 rounded-full animate-spin-slow bg-gradient-to-tr from-primary via-transparent to-pink-400 p-[2px]">
            <div className="h-full w-full rounded-full bg-background" />
          </div>
          <Image
            src="/images/avatar.jpg"
            alt="Febiyanto Rizki Qurbandi"
            fill
            className="rounded-full object-cover p-[3px]"
            priority
          />
        </div>
      </motion.div>

      {/* Status badge */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.0 }}
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
          </span>
          {t("openToWork") as string}
        </span>
      </motion.div>

      {/* Heading + typewriter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.08 }}
        className="flex flex-col gap-2"
      >
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          {t("greeting")}
        </h1>
        <p className="text-xl text-muted-foreground min-h-[1.75rem]">
          {t("typingPrefix")}{" "}
          <span className="font-semibold text-foreground">
            {displayed}
            <span className="animate-[blink_1s_step-end_infinite]">|</span>
          </span>
        </p>
      </motion.div>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="text-sm text-muted-foreground leading-relaxed"
      >
        {t("heroDesc")}
      </motion.p>

      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.22 }}
        className="flex flex-wrap gap-3"
      >
        <Link
          href="/project"
          className="inline-flex items-center rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          {t("viewProjects")}
        </Link>
        <a
          href="/blog"
          className="inline-flex items-center rounded-full border border-border px-5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          {t("viewBlog")}
        </a>
      </motion.div>

      {/* Social links — staggered */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="flex items-center gap-3 flex-wrap"
      >
        <span className="text-sm text-muted-foreground">{t("findMeOn")}</span>
        {SOCIAL_LINKS.map(({ path, href, label }, i) => (
          <motion.a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.35 + i * 0.06 }}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-all hover:border-primary/40 hover:text-foreground hover:scale-110"
            )}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
              <path d={path} />
            </svg>
          </motion.a>
        ))}
      </motion.div>
    </section>
  );
}
