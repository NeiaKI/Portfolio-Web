"use client";

import { useEffect, useState, useCallback, useRef, cloneElement, type ReactElement } from "react";
import { GitHubCalendar, type Activity } from "react-github-calendar";
import { useTheme } from "next-themes";
import { Code2 } from "lucide-react";

type WakaStats = {
  start: string;
  end: string;
  daily_avg: string;
  this_week: string;
  best_day: { date: string; time: string };
  all_time: string;
  languages: { name: string; percent: number }[];
  categories: { name: string; percent: number }[];
};

type GHStats = { total: number; thisWeek: number; bestDay: number; avg: number };

const GH_THEME = {
  dark: ["#313244", "#1e3a1a", "#2d5a27", "#4a9040", "#a6e3a1"],
  light: ["#ccd0da", "#c6e8c4", "#8dc68f", "#3da644", "#1b5e20"],
};

function StatCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-background p-3 shadow-sm">
      <p className="text-[11px] font-semibold text-foreground mb-1">{label}</p>
      <p className="text-sm text-muted-foreground leading-snug">{children}</p>
    </div>
  );
}

function useCountUp(target: number, duration: number, active: boolean) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    setVal(0);
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - t) ** 3;
      setVal(Math.round(eased * target));
      if (t < 1) requestAnimationFrame(tick);
      else setVal(target);
    };
    requestAnimationFrame(tick);
  }, [active, target, duration]);
  return val;
}

function ProgressRow({ name, percent, animStarted }: { name: string; percent: number; animStarted: boolean }) {
  const animated = useCountUp(percent, 1000, animStarted);
  return (
    <div className="flex items-center gap-2">
      <span className="w-28 text-xs text-foreground truncate shrink-0">{name}</span>
      <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-primary/70 transition-all duration-500"
          style={{ width: `${animated}%` }}
        />
      </div>
      <span className="text-xs text-muted-foreground w-7 text-right shrink-0 tabular-nums">{animated}%</span>
    </div>
  );
}

export function CodingProgress() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [waka, setWaka] = useState<WakaStats | null>(null);
  const [ghStats, setGhStats] = useState<GHStats | null>(null);
  const [animStarted, setAnimStarted] = useState(false);
  const captured = useRef(false);
  const calendarRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => setMounted(true), []);

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
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const ghTotal    = useCountUp(ghStats?.total    ?? 0, 1400, animStarted && !!ghStats);
  const ghThisWeek = useCountUp(ghStats?.thisWeek ?? 0, 1200, animStarted && !!ghStats);
  const ghBestDay  = useCountUp(ghStats?.bestDay  ?? 0, 1000, animStarted && !!ghStats);
  const ghAvg      = useCountUp(ghStats?.avg      ?? 0,  800, animStarted && !!ghStats);

  useEffect(() => {
    fetch("/api/wakatime")
      .then((r) => r.json())
      .then(setWaka)
      .catch(() => {});
  }, []);

  const captureGH = useCallback((data: Activity[]) => {
    if (!captured.current && data.length > 0) {
      captured.current = true;
      const total = data.reduce((s, d) => s + d.count, 0);
      const bestDay = Math.max(...data.map((d) => d.count));
      const nonZero = data.filter((d) => d.count > 0);
      const avg = nonZero.length > 0 ? Math.round(total / nonZero.length) : 0;
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 7);
      const thisWeek = data
        .filter((d) => new Date(d.date) >= cutoff)
        .reduce((s, d) => s + d.count, 0);
      Promise.resolve().then(() => setGhStats({ total, thisWeek, bestDay, avg }));
    }
    return data;
  }, []);

  const colorScheme = resolvedTheme === "dark" ? "dark" : "light";

  const [hoverLabel, setHoverLabel] = useState<string | null>(null);

  const legendColors = resolvedTheme === "dark" ? GH_THEME.dark : GH_THEME.light;

  const padData = useCallback((data: Activity[]) => {
    if (data.length === 0) return data;

    // Pad start: from first Sunday of May last year
    const firstDate = new Date(data[0].date);
    const mayStart = new Date();
    mayStart.setFullYear(mayStart.getFullYear() - 1);
    mayStart.setMonth(4);
    mayStart.setDate(1);
    mayStart.setDate(mayStart.getDate() - mayStart.getDay()); // back to Sunday
    const startPad: Activity[] = [];
    const cur = new Date(mayStart);
    while (cur < firstDate) {
      startPad.push({ date: cur.toISOString().split("T")[0], count: 0, level: 0 });
      cur.setDate(cur.getDate() + 1);
    }

    // Pad end: fill to last Saturday on or after May 31
    const lastDate = new Date(data[data.length - 1].date);
    const endOfMonth = new Date(lastDate.getFullYear(), lastDate.getMonth() + 1, 0); // last day of current month
    // extend to next Saturday after end of month
    const daysToSat = (6 - endOfMonth.getDay() + 7) % 7;
    const target = new Date(endOfMonth);
    target.setDate(target.getDate() + daysToSat);
    const endPad: Activity[] = [];
    const cursor2 = new Date(lastDate);
    cursor2.setDate(cursor2.getDate() + 1);
    while (cursor2 <= target) {
      endPad.push({ date: cursor2.toISOString().split("T")[0], count: 0, level: 0 });
      cursor2.setDate(cursor2.getDate() + 1);
    }

    return [...startPad, ...data, ...endPad];
  }, []);

  const renderBlock = (block: React.ReactElement, activity: Activity) => {
    const label = activity.count === 0
      ? `No contributions on ${activity.date}`
      : `${activity.count} contribution${activity.count !== 1 ? "s" : ""} on ${activity.date}`;
    return cloneElement(block as React.ReactElement<React.HTMLAttributes<SVGRectElement>>, {
      onMouseEnter: () => setHoverLabel(label),
      onMouseLeave: () => setHoverLabel(null),
      style: { cursor: "default" },
    });
  };

  return (
    <section ref={sectionRef} className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Code2 className="h-4 w-4 text-primary" />
        <h2 className="text-xl font-bold text-foreground">Coding Progress</h2>
      </div>

      <div className="rounded-xl border border-border bg-card p-3 sm:p-5 flex flex-col gap-4">
        {/* WakaTime stat grid */}
        {waka ? (
          <>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              <StatCard label="Start Date">{waka.start}</StatCard>
              <StatCard label="End Date">{waka.end}</StatCard>
              <StatCard label="Daily Coding Average">{waka.daily_avg}</StatCard>
              <StatCard label="This Week Coding Time">{waka.this_week}</StatCard>
              <StatCard label="Best Day Coding Time">
                {waka.best_day.date} ({waka.best_day.time})
              </StatCard>
              <StatCard label="All Time Since Today">{waka.all_time}</StatCard>
            </div>

            {/* Languages + Categories */}
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              <div className="rounded-lg border border-border/60 bg-background/50 p-3 flex flex-col gap-2">
                <p className="text-[11px] font-semibold text-foreground">Languages</p>
                {waka.languages.map((l) => (
                  <ProgressRow key={l.name} name={l.name} percent={l.percent} animStarted={animStarted} />
                ))}
              </div>
              <div className="rounded-lg border border-border/60 bg-background/50 p-3 flex flex-col gap-2">
                <p className="text-[11px] font-semibold text-foreground">Categories</p>
                {waka.categories.map((c) => (
                  <ProgressRow key={c.name} name={c.name} percent={c.percent} animStarted={animStarted} />
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-16 rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        )}

        {/* GitHub commit stats */}
        {ghStats && (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              { label: "Total",     value: ghTotal.toLocaleString(),    suffix: undefined },
              { label: "This Week", value: String(ghThisWeek),          suffix: undefined },
              { label: "Best Day",  value: String(ghBestDay),           suffix: undefined },
              { label: "Average",   value: String(ghAvg),               suffix: "/ day"   },
            ].map(({ label, value, suffix }) => (
              <div key={label} className="rounded-lg border border-border bg-background p-2.5 sm:p-3 shadow-sm">
                <p className="text-[11px] text-muted-foreground mb-1">{label}</p>
                <p className="text-lg sm:text-xl font-bold text-foreground tabular-nums">
                  {value}
                  {suffix && (
                    <span className="text-[10px] text-muted-foreground font-normal ml-1">
                      {suffix}
                    </span>
                  )}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* GitHub contribution calendar — circular blocks */}
        {mounted ? (
          <div ref={calendarRef} className="flex flex-col gap-2">
            <div className="overflow-x-auto [&>div]:w-full [&_svg]:w-full [&_svg]:h-auto">
              <GitHubCalendar
                username="NeiaKI"
                colorScheme={colorScheme}
                theme={GH_THEME}
                fontSize={10}
                blockSize={14}
                blockMargin={3}
                blockRadius={7}
                showColorLegend={false}
                showTotalCount={false}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                transformData={(data) => captureGH(padData(data as any)) as any}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                renderBlock={renderBlock as any}
                style={{ width: "100%" }}
              />
            </div>
            {/* Custom footer — fixed height so hover label doesn't cause layout shift */}
            <div className="flex h-6 items-center justify-between px-0.5">
              {/* Less … More legend */}
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <span>Less</span>
                {legendColors.map((color, i) => (
                  <svg key={i} width="11" height="11">
                    <rect width="11" height="11" rx="6" fill={color} />
                  </svg>
                ))}
                <span>More</span>
              </div>
              {/* Right: hover label or total count — same height regardless */}
              <span className={`rounded-md text-[11px] font-medium whitespace-nowrap transition-colors ${
                hoverLabel
                  ? "bg-foreground px-2 py-0.5 text-background"
                  : "text-muted-foreground"
              }`}>
                {hoverLabel ?? (ghStats ? `${ghStats.total.toLocaleString()} contributions in the last year` : "")}
              </span>
            </div>
          </div>
        ) : (
          <div className="h-24 rounded-lg bg-muted animate-pulse" />
        )}
      </div>
    </section>
  );
}
