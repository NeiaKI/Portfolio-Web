"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { GitHubCalendar } from "react-github-calendar";
import { useTheme } from "next-themes";
import { Code2 } from "lucide-react";

type Activity = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 };

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
  dark: ["#1e1e2e", "#1e3a1a", "#2d5a27", "#4a9040", "#a6e3a1"],
  light: ["#eff1f5", "#c6e8c4", "#8dc68f", "#3da644", "#1b5e20"],
};

function StatCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border/60 bg-background/50 p-3">
      <p className="text-[11px] font-semibold text-foreground mb-1">{label}</p>
      <p className="text-sm text-muted-foreground leading-snug">{children}</p>
    </div>
  );
}

function ProgressRow({ name, percent }: { name: string; percent: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-28 text-xs text-foreground truncate shrink-0">{name}</span>
      <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-muted-foreground/55 transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="text-xs text-muted-foreground w-7 text-right shrink-0">{percent}%</span>
    </div>
  );
}

export function CodingProgress() {
  const { resolvedTheme } = useTheme();
  const [waka, setWaka] = useState<WakaStats | null>(null);
  const [ghStats, setGhStats] = useState<GHStats | null>(null);
  const captured = useRef(false);

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

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Code2 className="h-4 w-4 text-primary" />
        <h2 className="text-xl font-bold text-foreground">Coding Progress</h2>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-4">
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
                  <ProgressRow key={l.name} name={l.name} percent={l.percent} />
                ))}
              </div>
              <div className="rounded-lg border border-border/60 bg-background/50 p-3 flex flex-col gap-2">
                <p className="text-[11px] font-semibold text-foreground">Categories</p>
                {waka.categories.map((c) => (
                  <ProgressRow key={c.name} name={c.name} percent={c.percent} />
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
              { label: "Total", value: ghStats.total.toLocaleString(), suffix: undefined },
              { label: "This Week", value: String(ghStats.thisWeek), suffix: undefined },
              { label: "Best Day", value: String(ghStats.bestDay), suffix: undefined },
              { label: "Average", value: String(ghStats.avg), suffix: "/ day" },
            ].map(({ label, value, suffix }) => (
              <div key={label} className="rounded-lg border border-border/60 bg-background/50 p-3">
                <p className="text-[11px] text-muted-foreground mb-1">{label}</p>
                <p className="text-xl font-bold text-foreground">
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
        <div className="overflow-x-auto">
          <GitHubCalendar
            username="NeiaKI"
            colorScheme={colorScheme}
            theme={GH_THEME}
            fontSize={10}
            blockSize={11}
            blockMargin={3}
            blockRadius={6}
            transformData={captureGH}
          />
        </div>
      </div>
    </section>
  );
}
