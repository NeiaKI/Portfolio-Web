"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

const TZ = "Asia/Jakarta";

function getJakartaTime() {
  return new Date(new Date().toLocaleString("en-US", { timeZone: TZ }));
}

export function ClockWidget() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(getJakartaTime());
    const id = setInterval(() => setNow(getJakartaTime()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!now) return null;

  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");

  const dateStr = now.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="rounded-xl border border-border bg-card p-4 flex flex-col gap-1.5">
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <Clock className="h-4 w-4 text-primary" />
        Jakarta
        <span className="ml-auto text-[11px] font-normal text-muted-foreground">GMT+7</span>
      </div>

      {/* Digital clock */}
      <div className="flex items-end gap-1 tabular-nums">
        <span className="text-3xl font-bold tracking-tight text-foreground">
          {hh}<span className="animate-pulse text-primary">:</span>{mm}
        </span>
        <span className="mb-0.5 text-lg font-semibold text-muted-foreground">
          :{ss}
        </span>
      </div>

      <p className="text-[11px] text-muted-foreground capitalize">{dateStr}</p>
    </div>
  );
}
