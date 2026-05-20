"use client";

import { LazyMotion, domAnimation, MotionConfig } from "framer-motion";

// Lazy-load fitur animasi (domAnimation = animate/gesture/exit, tanpa layout/drag).
// Komponen pakai <m.*> bukan <motion.*> agar bundle inti framer-motion kecil.
// reducedMotion="user" → hormati prefers-reduced-motion OS untuk animasi JS.
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
