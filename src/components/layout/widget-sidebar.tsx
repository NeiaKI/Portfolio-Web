"use client";

import { ClockWidget } from "@/components/widgets/clock-widget";
import { WeatherWidget } from "@/components/widgets/weather-widget";
import { SpotifyWidget } from "@/components/widgets/spotify-widget";
import { NowReading } from "@/components/widgets/now-reading";
import { WakaTimeLanguages } from "@/components/widgets/wakatime-languages";
import { ErrorBoundary } from "@/components/ui/error-boundary";

export function WidgetSidebar() {
  return (
    <aside className="flex h-full w-full flex-col gap-3 p-4 overflow-y-auto scrollbar-hide">
      <ErrorBoundary><ClockWidget /></ErrorBoundary>
      <ErrorBoundary><WeatherWidget /></ErrorBoundary>
      <ErrorBoundary><SpotifyWidget /></ErrorBoundary>
      <ErrorBoundary><WakaTimeLanguages /></ErrorBoundary>
      <ErrorBoundary><NowReading /></ErrorBoundary>
    </aside>
  );
}
