"use client";

import { useEffect, useState } from "react";
import { Music2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SpotifyData {
  isPlaying: boolean;
  configured: boolean;
  title?: string;
  artist?: string;
  album?: string;
  albumArt?: string | null;
  songUrl?: string;
  progress?: number;
  duration?: number;
}

function EqBars() {
  return (
    <span className="flex items-end gap-px h-3.5" aria-hidden>
      {[1, 2, 3].map((i) => (
        <span
          key={i}
          className="w-[3px] rounded-sm bg-green-500"
          style={{
            animation: `eq-bar ${0.5 + i * 0.15}s ease-in-out infinite alternate`,
            height: `${40 + i * 20}%`,
          }}
        />
      ))}
      <style>{`
        @keyframes eq-bar {
          from { transform: scaleY(0.3); }
          to   { transform: scaleY(1); }
        }
      `}</style>
    </span>
  );
}

export function SpotifyWidget() {
  const [data, setData] = useState<SpotifyData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = () =>
      fetch("/api/spotify")
        .then((r) => r.json())
        .then(setData)
        .catch(() => {})
        .finally(() => setLoading(false));

    load();
    const interval = setInterval(load, 30_000);
    return () => clearInterval(interval);
  }, []);

  const progressPct =
    data?.isPlaying && data.duration
      ? Math.round((data.progress! / data.duration) * 100)
      : null;

  const content = (
    <div
      className={cn(
        "group flex items-center gap-3 rounded-xl border border-border bg-card p-3.5 transition-all",
        data?.songUrl && "hover:border-green-500/30 hover:bg-card/80 cursor-pointer"
      )}
    >
      {/* Album art */}
      <div className="relative h-12 w-12 shrink-0 rounded-lg overflow-hidden bg-muted">
        {data?.albumArt ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={data.albumArt} alt={data.album} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Music2 className="h-5 w-5 text-muted-foreground/40" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-0.5 min-w-0">
        <div className="flex items-center gap-2">
          {/* Spotify icon */}
          <svg viewBox="0 0 24 24" className="h-3 w-3 shrink-0 text-green-500" fill="currentColor">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
          </svg>
          {loading ? (
            <span className="text-xs text-muted-foreground">Loading…</span>
          ) : data?.title ? (
            <span className="text-xs font-semibold text-foreground truncate">{data.title}</span>
          ) : (
            <span className="text-xs text-muted-foreground">Not playing</span>
          )}
          {data?.isPlaying && <EqBars />}
        </div>

        {data?.artist && (
          <p className="text-[11px] text-muted-foreground truncate">{data.artist}</p>
        )}

        {/* Status label + progress */}
        <div className="flex items-center gap-2 mt-0.5">
          <span className={cn("text-[10px] font-medium", data?.isPlaying ? "text-green-500" : "text-muted-foreground/60")}>
            {data?.isPlaying ? "Now Playing" : data?.title ? "Recently Played" : "Not listening"}
          </span>
        </div>

        {/* Progress bar for live track */}
        {progressPct !== null && (
          <div className="mt-1 h-0.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-green-500 transition-all duration-1000"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );

  return data?.songUrl ? (
    <a href={data.songUrl} target="_blank" rel="noopener noreferrer">
      {content}
    </a>
  ) : (
    content
  );
}
