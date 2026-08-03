"use client";

import { useEffect, useState } from "react";
import { ClockWidget } from "@/components/widgets/clock-widget";
import { WeatherWidget } from "@/components/widgets/weather-widget";
import { SpotifyWidget } from "@/components/widgets/spotify-widget";
import { NowReading } from "@/components/widgets/now-reading";
import { ErrorBoundary } from "@/components/ui/error-boundary";

// Container parent hanya tampil di ≥lg (CSS), tapi komponen tetap mount & fetch
// meski display:none. Gate dengan matchMedia agar widget tidak fetch di mobile.
export function WidgetSidebar() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)"); // tailwind lg
    setShow(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setShow(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <aside className="flex h-full w-full flex-col gap-3 p-4 overflow-y-auto scrollbar-hide">
      {show && (
        <>
          <ErrorBoundary><ClockWidget /></ErrorBoundary>
          <ErrorBoundary><WeatherWidget /></ErrorBoundary>
          <ErrorBoundary><SpotifyWidget /></ErrorBoundary>
          <ErrorBoundary><NowReading /></ErrorBoundary>
        </>
      )}
    </aside>
  );
}
