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

// Terminal selalu di-render dari SSR agar ada di HTML dari byte pertama.
// Blocking script di <head> menambah class "was-booted" ke <html> ketika
// sessionStorage.__booted sudah di-set → CSS [data-loader]{display:none} langsung
// menyembunyikannya sebelum browser paint, tanpa menunggu React hydrate.
export function LoadingScreen() {
  const [active, setActive]   = useState(true); // true = terminal ada di SSR HTML
  const [progress, setProgress] = useState(0);
  const [done, setDone]         = useState(false);

  useEffect(() => {
    // Sudah pernah boot → sembunyikan terminal (CSS sudah handle sebelum ini)
    if (sessionStorage.getItem("__booted")) {
      setActive(false);
      return;
    }

    sessionStorage.setItem("__booted", "1");

    const safety = setTimeout(() => setDone(true), 5000);

    const start = Date.now();
    const tick = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, Math.round((elapsed / (DURATION - 400)) * 100));
      setProgress(pct);
      if (pct >= 100) clearInterval(tick);
    }, 30);

    const exitTimer = setTimeout(() => setDone(true), DURATION);

    return () => {
      clearTimeout(safety);
      clearInterval(tick);
      clearTimeout(exitTimer);
    };
  }, []);

  return (
    <AnimatePresence>
      {active && !done && (
        <motion.div
          key="loader"
          data-loader
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-background"
        >
          <div className="absolute inset-0 dot-bg opacity-40" />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative w-full max-w-sm rounded-xl border border-border bg-card shadow-2xl overflow-hidden"
          >
            <div className="flex items-center gap-1.5 border-b border-border px-4 py-2.5 bg-muted/40">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
              <span className="ml-2 font-mono text-[11px] text-muted-foreground">
                bash — nateeki
              </span>
            </div>

            <div className="flex flex-col gap-1.5 p-5">
              {LINES.map((l) => (
                <TerminalLine key={l.text} text={l.text} delay={l.delay} />
              ))}

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
  );
}
