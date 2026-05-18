"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

interface LangData {
  this_week: string;
  languages: { name: string; percent: number }[];
}

const LANG_COLORS: Record<string, string> = {
  TypeScript:  "#3178C6",
  JavaScript:  "#F7DF1E",
  Python:      "#3776AB",
  Go:          "#00ADD8",
  Rust:        "#CE412B",
  Kotlin:      "#7F52FF",
  Java:        "#007396",
  PHP:         "#777BB4",
  Dart:        "#0175C2",
  CSS:         "#1572B6",
  HTML:        "#E34F26",
  Bash:        "#4EAA25",
  Shell:       "#4EAA25",
  Markdown:    "#083FA1",
  JSON:        "#909090",
  YAML:        "#CB171E",
  Dockerfile:  "#2496ED",
  SQL:         "#e38c00",
};

function bar(color: string, percent: number, animated: boolean) {
  return (
    <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{
          width: animated ? `${percent}%` : "0%",
          backgroundColor: color,
        }}
      />
    </div>
  );
}

export function WakaTimeLanguages() {
  const [data, setData] = useState<LangData | null>(null);
  const [loading, setLoading] = useState(true);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    fetch("/api/wakatime")
      .then((r) => r.json())
      .then((d: LangData) => {
        setData(d);
        setLoading(false);
        // slight delay so bars animate in after render
        setTimeout(() => setAnimated(true), 60);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="rounded-xl border border-border bg-card p-4 flex flex-col gap-3 animate-pulse">
        <div className="h-4 w-32 rounded bg-muted" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-3.5 rounded bg-muted" style={{ width: `${75 - i * 10}%` }} />
        ))}
      </div>
    );
  }

  if (!data?.languages?.length) return null;

  const langs = data.languages.slice(0, 6);

  return (
    <div className="rounded-xl border border-border bg-card p-4 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Clock className="h-3.5 w-3.5 text-primary" />
          Languages
        </div>
        <span className="text-[10px] text-muted-foreground">{data.this_week} this week</span>
      </div>

      {/* Stacked bar — full-width overview */}
      <div className="flex h-2 w-full overflow-hidden rounded-full gap-px">
        {langs.map((l) => (
          <div
            key={l.name}
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: animated ? `${l.percent}%` : "0%",
              backgroundColor: LANG_COLORS[l.name] ?? "#585b70",
            }}
          />
        ))}
      </div>

      {/* Per-language rows */}
      <div className="flex flex-col gap-2">
        {langs.map((l) => {
          const color = LANG_COLORS[l.name] ?? "#585b70";
          return (
            <div key={l.name} className="flex items-center gap-2">
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="w-[88px] text-[11px] text-foreground truncate shrink-0">{l.name}</span>
              {bar(color, l.percent, animated)}
              <span className="text-[11px] text-muted-foreground w-7 text-right shrink-0 tabular-nums">
                {l.percent}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
