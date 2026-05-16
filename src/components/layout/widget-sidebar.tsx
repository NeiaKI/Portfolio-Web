"use client";

import { useTranslations } from "next-intl";
import { Globe, Monitor, MapPin, Briefcase } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export function WidgetSidebar() {
  const t = useTranslations("sidebar");

  return (
    <aside className="flex h-full w-64 flex-col gap-3 p-4 overflow-y-auto scrollbar-hide">
      {/* Open to work */}
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="p-3">
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              {t("openToWork")}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Available for freelance & full-time roles
          </p>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card>
        <CardHeader className="pb-2 pt-3 px-3">
          <CardTitle className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {t("quickStats")}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-3">
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: "10+", label: t("projects") },
              { value: "2+", label: t("yearsExp") },
              { value: "20+", label: t("technologies") },
              { value: "∞", label: t("coffeeCups") },
            ].map(({ value, label }) => (
              <div
                key={label}
                className="flex flex-col items-center rounded-lg bg-muted p-2 text-center"
              >
                <span className="text-lg font-bold text-primary">{value}</span>
                <span className="text-[10px] text-muted-foreground leading-tight">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Visitor Info */}
      <Card>
        <CardHeader className="pb-2 pt-3 px-3">
          <CardTitle className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {t("visitorInfo")}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-3 space-y-2">
          {[
            { icon: Globe, label: t("ip"), value: "—" },
            { icon: Monitor, label: t("browser"), value: "—" },
            { icon: MapPin, label: t("location"), value: "—" },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <Icon className="h-3 w-3 text-muted-foreground" />
                <span className="text-[11px] text-muted-foreground">{label}</span>
              </div>
              <span className="text-[11px] font-mono text-foreground">
                {value}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Spotify — placeholder */}
      <Card>
        <CardHeader className="pb-2 pt-3 px-3">
          <CardTitle className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Spotify
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-3">
          <p className="text-[11px] text-muted-foreground">Not connected yet</p>
        </CardContent>
      </Card>

      {/* Weather — placeholder */}
      <Card>
        <CardHeader className="pb-2 pt-3 px-3">
          <CardTitle className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Weather
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-3">
          <p className="text-[11px] text-muted-foreground">Malang, ID</p>
          <p className="text-2xl font-bold text-foreground mt-1">—°C</p>
        </CardContent>
      </Card>
    </aside>
  );
}
