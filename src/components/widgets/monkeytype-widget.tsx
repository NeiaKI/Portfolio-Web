"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useTheme } from "@/lib/theme";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Keyboard, Target, Zap, Clock, TrendingUp, Award } from "lucide-react";
import { SkeletonStatGrid, Skeleton } from "@/components/ui/skeleton";

interface PBMode { mode: string; wpm: number; acc: number; consistency: number }

interface MonkeyData {
  bestWpm: number;
  bestRaw: number;
  bestAcc: number;
  bestConsistency: number;
  avgWpm: number;
  completedTests: number;
  startedTests: number;
  timeTyping: string;
  streak: number;
  pbByMode: PBMode[];
}

function useCountUp(target: number, duration: number, active: boolean, decimals = 0) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    setVal(0);
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - t) ** 3;
      setVal(parseFloat((eased * target).toFixed(decimals)));
      if (t < 1) requestAnimationFrame(tick);
      else setVal(target);
    };
    requestAnimationFrame(tick);
  }, [active, target, duration, decimals]);
  return val;
}

function StatCard({
  icon: Icon,
  numericValue,
  suffix = "",
  staticValue,
  label,
  sub,
  color,
  started,
  decimals = 0,
}: {
  icon: React.ElementType;
  numericValue?: number;
  suffix?: string;
  staticValue?: string;
  label: string;
  sub?: string;
  color?: string;
  started?: boolean;
  decimals?: number;
}) {
  const animated = useCountUp(numericValue ?? 0, 1400, !!started && numericValue !== undefined, decimals);
  const display = staticValue ?? `${decimals > 0 ? animated.toFixed(decimals) : animated}${suffix}`;

  return (
    <div className="rounded-lg border border-border bg-background p-3 flex gap-3 items-start shadow-sm">
      <div className={`mt-0.5 rounded-md p-1.5 bg-muted ${color ?? "text-muted-foreground"}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className={`text-2xl font-bold leading-none tabular-nums ${color ?? "text-foreground"}`}>{display}</p>
        <p className="text-[11px] text-foreground mt-1">{label}</p>
        {sub && <p className="text-[10px] text-muted-foreground mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export function MonkeyTypeWidget() {
  const [data, setData] = useState<MonkeyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [animStarted, setAnimStarted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const { mode } = useTheme();
  const isDark = mode === "dark";

  const C = {
    primary:    isDark ? "#89b4fa" : "#1e66f5",
    green:      isDark ? "#a6e3a1" : "#40a02b",
    border:     isDark ? "#313244" : "#ccd0da",
    muted:      isDark ? "#6c7086" : "#8c8fa1",
    card:       isDark ? "#1e1e2e" : "#eff1f5",
    foreground: isDark ? "#cdd6f4" : "#4c4f69",
    accBar:     isDark ? "#89b4fa" : "#1e66f5",
    conBar:     isDark ? "#585b70" : "#7c7f93",
  };

  useEffect(() => {
    fetch("/api/monkeytype")
      .then((r) => r.json())
      .then((d) => { if (!d.error) setData(d); })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Keyboard className="h-4 w-4 text-primary" />
          <h2 className="text-xl font-bold text-foreground">MonkeyType Performance</h2>
        </div>
        <span className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-[11px] text-muted-foreground">
          <TrendingUp className="h-3 w-3" /> Personal Bests
        </span>
      </div>

      <div className="rounded-xl border border-border bg-card p-3 sm:p-5 flex flex-col gap-4">
        {loading ? (
          <>
            <SkeletonStatGrid cols={3} count={6} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Skeleton className="h-[188px] w-full" />
              <Skeleton className="h-[188px] w-full" />
            </div>
          </>
        ) : data ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <StatCard icon={Zap}      numericValue={data.bestWpm}         suffix=""  label="Best WPM"          sub={`Avg: ${data.avgWpm} WPM`}              color="text-primary"          started={animStarted} />
              <StatCard icon={Target}   numericValue={data.bestAcc}          suffix="%" label="Best Accuracy"     sub={`Consistency: ${data.bestConsistency}%`} color="text-primary"          started={animStarted} />
              <StatCard icon={Keyboard} numericValue={data.completedTests}   suffix=""  label="Tests Completed"  sub={`${data.startedTests.toLocaleString()} started`} color="text-foreground" started={animStarted} />
              <StatCard icon={Clock}    staticValue={data.timeTyping}                   label="Time Typing"                                                       color="text-foreground"       started={animStarted} />
              <StatCard icon={Zap}      numericValue={data.bestRaw}          suffix=""  label="Best Raw WPM"     sub="Uncorrected speed"                        color="text-foreground"       started={animStarted} />
              <StatCard icon={Award}    numericValue={data.bestConsistency}  suffix="%" label="Best Consistency" sub="Typing stability"                          color="text-primary"          started={animStarted} decimals={1} />
            </div>

            {data.pbByMode.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-lg border border-border bg-background p-3 shadow-sm min-w-0">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
                    <p className="text-[11px] font-semibold text-foreground">WPM by Mode</p>
                  </div>
                  <div className="overflow-x-auto">
                    <div style={{ minWidth: 200 }}>
                      <ResponsiveContainer width="100%" height={140}>
                        <LineChart data={data.pbByMode}>
                          <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                          <XAxis dataKey="mode" tick={{ fontSize: 10, fill: C.muted }} />
                          <YAxis tick={{ fontSize: 10, fill: C.muted }} />
                          <Tooltip contentStyle={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 11, color: C.foreground }} labelStyle={{ color: C.foreground }} />
                          <Line type="monotone" dataKey="wpm" stroke={C.primary} strokeWidth={2} dot={{ r: 4, fill: C.primary }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-border bg-background p-3 shadow-sm min-w-0">
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="h-3.5 w-3.5 text-muted-foreground" />
                    <p className="text-[11px] font-semibold text-foreground">Accuracy & Consistency</p>
                  </div>
                  <div className="overflow-x-auto">
                    <div style={{ minWidth: 200 }}>
                      <ResponsiveContainer width="100%" height={140}>
                        <BarChart data={data.pbByMode}>
                          <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                          <XAxis dataKey="mode" tick={{ fontSize: 10, fill: C.muted }} />
                          <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: C.muted }} />
                          <Tooltip contentStyle={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 11, color: C.foreground }} labelStyle={{ color: C.foreground }} />
                          <Bar dataKey="acc" name="Accuracy" fill={C.accBar} radius={[3, 3, 0, 0]} />
                          <Bar dataKey="consistency" name="Consistency" fill={C.conBar} radius={[3, 3, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <p className="text-sm text-muted-foreground">MonkeyType data unavailable.</p>
        )}
      </div>
    </section>
  );
}
