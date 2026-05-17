"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

function useCountUp(target: number, duration = 1400, trigger: boolean) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!trigger) return;
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, trigger]);

  return count;
}

interface StatItemProps {
  value: number;
  suffix?: string;
  label: string;
  trigger: boolean;
}

function StatItem({ value, suffix = "+", label, trigger }: StatItemProps) {
  const count = useCountUp(value, 1200, trigger);
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-2xl font-black text-foreground tabular-nums">
        {count}{suffix}
      </span>
      <span className="text-[11px] text-muted-foreground text-center leading-tight">{label}</span>
    </div>
  );
}

export function StatsSection() {
  const t = useTranslations("sidebar");
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const STATS = [
    { value: 3,  suffix: "+", label: t("yearsExp") },
    { value: 20, suffix: "+", label: t("projects") },
    { value: 40, suffix: "+", label: t("technologies") },
    { value: 20, suffix: "+", label: "Certifications" },
  ];

  return (
    <div ref={ref} className="grid grid-cols-4 gap-2 rounded-xl border border-border bg-card p-4">
      {STATS.map((s, i) => (
        <StatItem key={i} {...s} trigger={visible} />
      ))}
    </div>
  );
}
