import { NextResponse } from "next/server";
import { withCache } from "@/lib/api-cache";

export const dynamic = "force-dynamic";

const SPOTIFY_TIMEOUT_MS = 10_000;
const NO_STORE_HEADERS = { "Cache-Control": "no-store" };

type SpotifyResponse =
  | { isPlaying: false; configured: false; reason?: string }
  | { isPlaying: false; configured: true; title?: string; artist?: string; album?: string; albumArt?: string | null; songUrl?: string }
  | {
      isPlaying: true;
      configured: true;
      title: string;
      artist: string;
      album: string;
      albumArt: string | null;
      songUrl: string;
      progress: number;
      duration: number;
    };

async function getAccessToken(clientId: string, clientSecret: string, refreshToken: string): Promise<string> {
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
    },
    body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: refreshToken }),
    cache: "no-store",
    signal: AbortSignal.timeout(SPOTIFY_TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`Spotify token request failed (${res.status})`);
  const data = await res.json() as { access_token?: unknown };
  if (typeof data.access_token !== "string" || !data.access_token) {
    throw new Error("Spotify token response is invalid");
  }
  return data.access_token;
}

async function fetchSpotify(clientId: string, clientSecret: string, refreshToken: string): Promise<SpotifyResponse> {
  const token = await getAccessToken(clientId, clientSecret, refreshToken);
  const headers = { Authorization: `Bearer ${token}` };

  const nowRes = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
    headers,
    cache: "no-store",
    signal: AbortSignal.timeout(SPOTIFY_TIMEOUT_MS),
  });

  if (nowRes.status === 200) {
    const text = await nowRes.text();
    if (text) {
      let data: Record<string, unknown>;
      try { data = JSON.parse(text); } catch { data = {}; }
      if (data?.is_playing && data?.item) {
        const track = data.item as Record<string, unknown>;
        const artists = Array.isArray(track.artists)
          ? (track.artists as { name: string }[]).map((a) => a.name).join(", ")
          : "Unknown";
        return {
          isPlaying: true,
          configured: true,
          title: track.name as string,
          artist: artists,
          album: (track.album as Record<string, unknown>)?.name as string ?? "",
          albumArt: ((track.album as Record<string, unknown>)?.images as { url: string }[])?.[0]?.url ?? null,
          songUrl: (track.external_urls as Record<string, string>)?.spotify ?? "",
          progress: data.progress_ms as number,
          duration: track.duration_ms as number,
        };
      }
    }
  }

  const recentRes = await fetch(
    "https://api.spotify.com/v1/me/player/recently-played?limit=1",
    { headers, cache: "no-store", signal: AbortSignal.timeout(SPOTIFY_TIMEOUT_MS) }
  );

  if (!recentRes.ok) return { isPlaying: false, configured: true };

  const recentText = await recentRes.text();
  if (!recentText) return { isPlaying: false, configured: true };

  let recent: Record<string, unknown>;
  try { recent = JSON.parse(recentText); } catch { return { isPlaying: false, configured: true }; }
  const track = (recent?.items as { track: Record<string, unknown> }[])?.[0]?.track;
  if (!track) return { isPlaying: false, configured: true };

  const artists = Array.isArray(track.artists)
    ? (track.artists as { name: string }[]).map((a) => a.name).join(", ")
    : "Unknown";

  return {
    isPlaying: false,
    configured: true,
    title: track.name as string,
    artist: artists,
    album: (track.album as Record<string, unknown>)?.name as string ?? "",
    albumArt: ((track.album as Record<string, unknown>)?.images as { url: string }[])?.[0]?.url ?? null,
    songUrl: (track.external_urls as Record<string, string>)?.spotify ?? "",
  };
}

export async function GET() {
  const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
  const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
  const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;

  if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
    return NextResponse.json(
      { isPlaying: false, configured: false, reason: "missing_env" },
      { headers: NO_STORE_HEADERS }
    );
  }

  try {
    // TTL 30s — now-playing bisa cepet berubah, tapi cukup untuk meredam rate-limit
    const data = await withCache<SpotifyResponse>("spotify:now", 30, () =>
      fetchSpotify(CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN)
    );
    return NextResponse.json(data, { headers: NO_STORE_HEADERS });
  } catch {
    return NextResponse.json(
      { isPlaying: false, configured: false },
      { headers: NO_STORE_HEADERS }
    );
  }
}
