"use client";

import { WeatherWidget } from "@/components/widgets/weather-widget";
import { SpotifyWidget } from "@/components/widgets/spotify-widget";

export function WidgetSidebar() {
  return (
    <aside className="flex h-full w-full flex-col gap-3 p-4 overflow-y-auto scrollbar-hide">
      <WeatherWidget />
      <SpotifyWidget />
    </aside>
  );
}
