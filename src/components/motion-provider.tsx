"use client";

import { LazyMotion, domAnimation } from "framer-motion";

// Lazy-load fitur animasi (domAnimation = animate/gesture/exit, tanpa layout/drag).
// Komponen pakai <m.*> bukan <motion.*> agar bundle inti framer-motion kecil.
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <LazyMotion features={domAnimation}>{children}</LazyMotion>;
}
