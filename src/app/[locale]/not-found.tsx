"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Home, ArrowRight } from "lucide-react";

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

const i18n = {
  en: {
    title: "Page Not Found",
    desc: "The page you're looking for isn't available — the URL might be mistyped or the page has been moved.",
    cta: "Back to Home",
    links: [
      { href: "/", label: "Home" },
      { href: "/project", label: "Projects" },
      { href: "/blog", label: "Blog" },
      { href: "/contact", label: "Contact" },
    ],
  },
  id: {
    title: "Halaman Tidak Ditemukan",
    desc: "Sepertinya halaman yang kamu tuju tidak tersedia — URL mungkin salah ketik atau halaman sudah dipindahkan.",
    cta: "Kembali ke Beranda",
    links: [
      { href: "/", label: "Beranda" },
      { href: "/project", label: "Proyek" },
      { href: "/blog", label: "Blog" },
      { href: "/contact", label: "Kontak" },
    ],
  },
};

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

export default function NotFound() {
  const params = useParams();
  const locale = ((params?.locale as string) === "id" ? "id" : "en") as "en" | "id";
  const t = i18n[locale];
  const [cursor, setCursor] = useState(true);

  useEffect(() => {
    const id = setInterval(() => setCursor((c) => !c), 530);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-8 px-4 text-center">
      {/* Glitch number */}
      <div className="relative select-none">
        <p className="text-[9rem] font-black leading-none text-foreground/5 sm:text-[11rem]">404</p>
        <p className="absolute inset-0 flex items-center justify-center text-[9rem] font-black leading-none text-primary/20 sm:text-[11rem] blur-sm">404</p>
        <p className="absolute inset-0 flex items-center justify-center text-[9rem] font-black leading-none text-foreground/[0.07] sm:text-[11rem]">404</p>
      </div>

      <div className="-mt-6 flex flex-col items-center gap-1">
        <h1 className="text-2xl font-bold text-foreground">{t.title}</h1>
        <p className="text-sm text-muted-foreground">{t.desc}</p>
      </div>

      {/* Terminal */}
      <div className="w-full max-w-sm rounded-xl border border-border bg-card text-left overflow-hidden shadow-lg">
        <div className="flex items-center gap-1.5 border-b border-border px-4 py-2.5 bg-muted/40">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
          <span className="ml-2 text-[11px] text-muted-foreground font-mono">bash — 80×24</span>
        </div>
        <div className="flex flex-col gap-0.5 p-4">
          {TERMINAL_LINES.map((line, i) => (
            <TerminalLine key={i} text={line} delay={i * 180} />
          ))}
          <p className="font-mono text-xs text-primary mt-1">
            $ <span className={`inline-block w-2 h-3 bg-primary align-middle ${cursor ? "opacity-100" : "opacity-0"}`} />
          </p>
        </div>
      </div>

      {/* Nav links */}
      <div className="flex flex-wrap justify-center gap-2">
        {t.links.map(({ href, label }) => (
          <Link
            key={href}
            href={`/${locale}${href === "/" ? "" : href}`}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
          >
            {label}
            <ArrowRight className="h-3 w-3" />
          </Link>
        ))}
      </div>

      <Link
        href={`/${locale}`}
        className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
      >
        <Home className="h-4 w-4" />
        {t.cta}
      </Link>
    </div>
  );
}
