"use client";

import { useEffect, useState } from "react";
import { Cloud, Droplets, MapPin, Thermometer } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface WeatherData {
  temp_c: number;
  feels_like_c: number;
  humidity: number;
  desc: string;
}

export function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/weather")
      .then((r) => r.json())
      .then((d) => {
        if (!d.error) setWeather(d);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="rounded-xl border border-border bg-card p-4 flex flex-col gap-3">
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <Cloud className="h-4 w-4 text-primary" />
        Weather
      </div>

      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <MapPin className="h-3 w-3" />
        Tangerang Selatan, ID
      </div>

      {loading ? (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-3 w-32" />
          <div className="flex gap-4 mt-1">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-12" />
          </div>
        </div>
      ) : weather ? (
        <div className="flex flex-col gap-1">
          <p className="text-3xl font-bold text-foreground">{weather.temp_c}°C</p>
          <p className="text-xs text-muted-foreground">{weather.desc}</p>
          <div className="flex items-center gap-4 mt-1 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <Thermometer className="h-3 w-3" />
              Feels {weather.feels_like_c}°C
            </span>
            <span className="flex items-center gap-1">
              <Droplets className="h-3 w-3" />
              {weather.humidity}%
            </span>
          </div>
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">Weather unavailable</p>
      )}
    </div>
  );
}
