"use client";

import { m, AnimatePresence, type Variants } from "framer-motion";
import { usePathname } from "next/navigation";

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07, delayChildren: 0.05 },
  },
  // Exit instan — tidak ada stagger agar halaman baru langsung muncul tanpa jeda
  exit: {
    transition: { staggerChildren: 0 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16, filter: "blur(4px)" },
  show:   { opacity: 1, y: 0,  filter: "blur(0px)", transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
  exit:   { opacity: 0, transition: { duration: 0.1, ease: "easeIn" as const } },
};

// Module-level Set persists for the browser session — no stagger on return visits
const visited = new Set<string>();

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isFirstVisit = !visited.has(pathname);
  if (isFirstVisit) visited.add(pathname);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <m.div
        key={pathname}
        variants={container}
        initial={isFirstVisit ? "hidden" : "show"}
        animate="show"
        exit="exit"
      >
        {children}
      </m.div>
    </AnimatePresence>
  );
}

export function FadeSection({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <m.div variants={item} className={className}>
      {children}
    </m.div>
  );
}
