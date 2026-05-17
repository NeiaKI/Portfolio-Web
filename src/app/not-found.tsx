"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ThemeProvider } from "next-themes";
import { Home } from "lucide-react";

const TERMINAL_LINES = [
  "$ cd /requested-page",
  "bash: cd: /requested-page: No such file or directory",
  "$ ls -la",
  "total 0",
  "$ find / -name 'page' 2>/dev/null",
  "find: nothing found.",
  "$ echo $?",
  "404",
];

function TerminalLine({ text, delay }: { text: string; delay: number }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  if (!visible) return null;
  const isCmd = text.startsWith("$");
  return (
    <p className={`font-mono text-xs leading-relaxed ${isCmd ? "text-primary" : "text-muted-foreground"}`}>
      {text}
    </p>
  );
}

const i18n = {
  en: {
    title: "Page Not Found",
    desc: "The page you're looking for isn't available — the URL might be mistyped or the page has been moved.",
    cta: "Back to Home",
  },
  id: {
    title: "Halaman Tidak Ditemukan",
    desc: "Sepertinya halaman yang kamu tuju tidak tersedia — URL mungkin salah ketik atau halaman sudah dipindahkan.",
    cta: "Kembali ke Beranda",
  },
};

function NotFoundContent() {
  const [cursor, setCursor] = useState(true);
  const [locale, setLocale] = useState<"en" | "id">("en");

  useEffect(() => {
    const id = setInterval(() => setCursor((c) => !c), 530);
    const path = window.location.pathname;
    if (path.startsWith("/id")) setLocale("id");
    return () => clearInterval(id);
  }, []);

  const t = i18n[locale];

  return (
    <div className="dot-bg relative flex min-h-screen flex-col items-center justify-center gap-8 bg-background px-4 text-center">
      {/* Big 404 */}
      <div className="relative select-none">
        <p className="text-[10rem] font-black leading-none text-foreground/5 sm:text-[13rem]">404</p>
        <p className="absolute inset-0 flex items-center justify-center text-[10rem] font-black leading-none text-primary/20 blur-sm sm:text-[13rem]">404</p>
        <p className="absolute inset-0 flex items-center justify-center text-[10rem] font-black leading-none text-foreground/[0.06] sm:text-[13rem]">404</p>
      </div>

      {/* Human-friendly message */}
      <div className="-mt-8 flex flex-col items-center gap-1.5">
        <h1 className="text-2xl font-bold text-foreground">{t.title}</h1>
        <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">{t.desc}</p>
      </div>

      {/* Terminal */}
      <div className="w-full max-w-sm overflow-hidden rounded-xl border border-border bg-card shadow-xl">
        <div className="flex items-center gap-1.5 border-b border-border bg-muted/40 px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
          <span className="ml-2 font-mono text-[11px] text-muted-foreground">bash — 80×24</span>
        </div>
        <div className="flex flex-col gap-0.5 p-4 text-left">
          {TERMINAL_LINES.map((line, i) => (
            <TerminalLine key={i} text={line} delay={i * 180} />
          ))}
          <p className="mt-1 font-mono text-xs text-primary">
            ${" "}
            <span className={`inline-block h-3 w-2 align-middle bg-primary ${cursor ? "opacity-100" : "opacity-0"}`} />
          </p>
        </div>
      </div>

      {/* Primary CTA */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
      >
        <Home className="h-4 w-4" />
        {t.cta}
      </Link>
    </div>
  );
}

export default function NotFound() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} scriptProps={{ suppressHydrationWarning: true }}>
      <NotFoundContent />
    </ThemeProvider>
  );
}
