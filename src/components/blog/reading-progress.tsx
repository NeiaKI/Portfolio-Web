"use client";

import { useEffect, useState, useRef } from "react";

export function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  const articleRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const article = document.querySelector("article");
    if (!article) return;

    function update() {
      const rect = article!.getBoundingClientRect();
      const articleTop = rect.top + window.scrollY;
      const articleH = article!.clientHeight;
      const scrolled = window.scrollY - articleTop;
      const pct = Math.min(100, Math.max(0, (scrolled / articleH) * 100));
      setProgress(pct);
    }

    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div
      className="fixed top-[2px] left-0 z-[9998] h-[2px] bg-purple-400/70 transition-[width] duration-75 ease-out pointer-events-none"
      style={{ width: `${progress}%` }}
    />
  );
}
