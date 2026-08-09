"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Gauge, RefreshCcw } from "lucide-react";
import type { RouterUsage } from "@/app/api/router-usage/route";

function formatTokens(n: number): string {
  if (n >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return String(n);
}

export function RouterUsageWidget() {
  const t = useTranslations("widgets");
  const [usage, setUsage] = useState<RouterUsage | null>(null);

  useEffect(() => {
    fetch("/api/router-usage")
      .then((r) => (r.ok ? r.json() : null))
      .then(setUsage)
      .catch(() => setUsage(null));
  }, []);

  if (!usage || !usage.configured) return null;

  const cost = usage.cost.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  });

  return (
    <div className="rounded-xl border border-border bg-card p-4 flex flex-col gap-2">
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <Gauge className="h-4 w-4 text-primary" />
        {t("routerUsageTitle")}
        <span className="ml-auto flex items-center gap-1 text-[11px] font-normal text-muted-foreground">
          <RefreshCcw className="h-3 w-3" />
          {usage.days}d
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-0.5 rounded-lg bg-muted/60 px-2.5 py-2">
          <span className="text-base font-bold tabular-nums text-foreground">
            {formatTokens(usage.totalTokens)}
          </span>
          <span className="text-[10px] text-muted-foreground">{t("routerUsageTokens")}</span>
        </div>
        <div className="flex flex-col gap-0.5 rounded-lg bg-muted/60 px-2.5 py-2">
          <span className="text-base font-bold tabular-nums text-foreground">{cost}</span>
          <span className="text-[10px] text-muted-foreground">{t("routerUsageCost")}</span>
        </div>
        <div className="flex flex-col gap-0.5 rounded-lg bg-muted/60 px-2.5 py-2">
          <span className="text-base font-bold tabular-nums text-foreground">
            {usage.requests.toLocaleString()}
          </span>
          <span className="text-[10px] text-muted-foreground">{t("routerUsageRequests")}</span>
        </div>
        <div className="flex flex-col gap-0.5 rounded-lg bg-muted/60 px-2.5 py-2">
          <span className="text-base font-bold tabular-nums text-foreground">
            {formatTokens(usage.promptTokens)}
          </span>
          <span className="text-[10px] text-muted-foreground">{t("routerUsagePrompt")}</span>
        </div>
      </div>

      {usage.updatedAt && (
        <p className="text-[10px] text-muted-foreground/70">
          {t("routerUsageUpdated")}{" "}
          {new Date(usage.updatedAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </p>
      )}
    </div>
  );
}
