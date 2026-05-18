"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Send, CheckCircle, MessageSquare, Mail } from "lucide-react";
import { SOCIAL_LINKS } from "@/lib/social-links";

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
            {SOCIAL_LINKS.map(({ label, href, path }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition-colors hover:bg-muted group"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground group-hover:text-foreground transition-colors">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
                    <path d={path} />
                  </svg>
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
