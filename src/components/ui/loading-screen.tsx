"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LINES = [
  { text: "$ boot nateeki.dev", delay: 0 },
  { text: "  → loading modules...", delay: 320 },
  { text: "  → mounting filesystem...", delay: 620 },
  { text: "  → starting services...", delay: 920 },
  { text: "  ✓ ready", delay: 1200 },
];

const DURATION = 2200;

function TerminalLine({ text, delay }: { text: string; delay: number }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  const isCmd  = text.startsWith("$");
  const isOk   = text.includes("✓");
  const isStep = text.startsWith("  →");

  return (
    <motion.p
      initial={{ opacity: 0, x: -6 }}
      animate={visible ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.2 }}
      className={`font-mono text-xs leading-relaxed ${
        isCmd  ? "text-primary font-semibold" :
        isOk   ? "text-green-400" :
        isStep ? "text-muted-foreground" :
                 "text-foreground"
      }`}
    >
      {text}
    </motion.p>
  );
}

export function LoadingScreen() {
  const [visible, setVisible]   = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone]         = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Jika sudah pernah load session ini — hapus will-load class (safety) dan skip
    if (sessionStorage.getItem("__booted")) {
      document.documentElement.classList.remove("will-load");
      return;
    }

    sessionStorage.setItem("__booted", "1");
    setVisible(true);

    // Safety: pastikan halaman tidak tersembunyi selamanya jika ada error
    const safety = setTimeout(() => {
      document.documentElement.classList.remove("will-load");
    }, 5000);

    // Progress bar
    const start = Date.now();
    const tick = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, Math.round((elapsed / (DURATION - 400)) * 100));
      setProgress(pct);
      if (pct >= 100) clearInterval(tick);
    }, 30);

    // Reveal konten + mulai exit animation
    const exitTimer = setTimeout(() => {
      document.documentElement.classList.remove("will-load");
      setDone(true);
    }, DURATION);

    return () => {
      clearTimeout(safety);
      clearInterval(tick);
      clearTimeout(exitTimer);
      document.documentElement.classList.remove("will-load");
    };
  }, []);

  // Wrapper ini selalu ada di DOM dengan visibility:visible
  // sehingga loading screen tetap tampil meski html.will-load menyembunyikan semua elemen lain
  return (
    <div style={{ visibility: "visible" }}>
    <AnimatePresence>
      {visible && !done && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-background"
        >
          {/* Dot pattern */}
          <div className="absolute inset-0 dot-bg opacity-40" />

          {/* Terminal card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative w-full max-w-sm rounded-xl border border-border bg-card shadow-2xl overflow-hidden"
          >
            {/* Title bar */}
            <div className="flex items-center gap-1.5 border-b border-border px-4 py-2.5 bg-muted/40">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
              <span className="ml-2 font-mono text-[11px] text-muted-foreground">
                bash — nateeki
              </span>
            </div>

            {/* Terminal body */}
            <div className="flex flex-col gap-1.5 p-5">
              {LINES.map((l) => (
                <TerminalLine key={l.text} text={l.text} delay={l.delay} />
              ))}

              {/* Progress bar */}
              <div className="mt-3 flex flex-col gap-1.5">
                <div className="h-1 w-full rounded-full bg-muted overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-primary"
                    initial={{ width: "0%" }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
                <p className="font-mono text-[10px] text-muted-foreground text-right">
                  {progress}%
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </div>
  );
}
