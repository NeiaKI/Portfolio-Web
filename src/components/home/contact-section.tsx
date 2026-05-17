"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Send, CheckCircle, MessageSquare, Mail } from "lucide-react";

const SOCIAL_LINKS = [
  {
    label: "GitHub",
    href: "https://github.com/NeiaKI",
    svg: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/febiyanto-rizki",
    svg: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://instagram.com/nateeki",
    svg: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    label: "Twitter / X",
    href: "https://x.com/nateeki",
    svg: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
];

const inputCls =
  "w-full rounded-lg border border-border bg-muted/40 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors";

export function ContactSection() {
  const t = useTranslations("contact");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="flex flex-col gap-4">
      {/* Heading */}
      <div className="border-l-4 border-primary pl-4">
        <h2 className="text-xl font-bold text-foreground">{t("title")}</h2>
        <p className="mt-0.5 text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
        {/* Left: Connect */}
        <div className="md:col-span-2 flex flex-col rounded-2xl border border-border/40 bg-card overflow-hidden">
          <div className="flex items-center gap-2 border-b border-border/40 px-5 py-4">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium text-foreground">{t("connectTitle")}</span>
          </div>
          <p className="px-5 pt-3 pb-1 text-xs text-muted-foreground">{t("connectSub")}</p>

          <div className="flex flex-col divide-y divide-border/40 px-2 py-1">
            {SOCIAL_LINKS.map(({ label, href, svg }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition-colors hover:bg-muted group"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground group-hover:text-foreground transition-colors">
                  {svg}
                </div>
                <span className="font-medium text-foreground">{label}</span>
              </a>
            ))}
          </div>

          <div className="mt-auto border-t border-border/40 px-5 py-4">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted">
                <Mail className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-foreground">{t("preferEmail")}</span>
                <span className="text-xs text-muted-foreground mt-0.5">{t("preferEmailSub")}</span>
                <a
                  href="mailto:febieki562@gmail.com"
                  className="mt-1 text-xs text-primary hover:underline"
                >
                  febieki562@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Form */}
        <div className="md:col-span-3 flex flex-col rounded-2xl border border-border/40 bg-card overflow-hidden">
          <div className="flex items-center gap-2 border-b border-border/40 px-5 py-4">
            <Send className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium text-foreground">{t("formTitle")}</span>
          </div>
          <p className="px-5 pt-3 pb-1 text-xs text-muted-foreground">{t("formSub")}</p>

          {status === "success" ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 py-16 text-center px-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">{t("success")}</p>
                <p className="mt-1 text-sm text-muted-foreground">{t("successDesc")}</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-5">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-muted-foreground">{t("email")}</label>
                  <input
                    type="email"
                    required
                    className={inputCls}
                    placeholder={t("emailPlaceholder")}
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-muted-foreground">{t("name")}</label>
                  <input
                    type="text"
                    required
                    className={inputCls}
                    placeholder={t("namePlaceholder")}
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">{t("message")}</label>
                <textarea
                  required
                  rows={6}
                  className={`${inputCls} resize-none`}
                  placeholder={t("messagePlaceholder")}
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                />
              </div>
              {status === "error" && (
                <p className="text-xs text-destructive">{t("error")}</p>
              )}
              <button
                type="submit"
                disabled={status === "sending"}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-80 disabled:opacity-50"
              >
                <Send className="h-3.5 w-3.5" />
                {status === "sending" ? t("sending") : t("send")}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
