import { NextResponse } from "next/server";
import { withCache } from "@/lib/api-cache";

export const dynamic = "force-dynamic";

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
  });
  if (!res.ok) throw new Error(`Token error: ${res.status} ${await res.text()}`);
  const data = await res.json();
  if (!data.access_token) throw new Error(`No access_token in response: ${JSON.stringify(data)}`);
  return data.access_token;
}

async function fetchSpotify(clientId: string, clientSecret: string, refreshToken: string): Promise<SpotifyResponse> {
  const token = await getAccessToken(clientId, clientSecret, refreshToken);
  const headers = { Authorization: `Bearer ${token}` };

  const nowRes = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
    headers,
    cache: "no-store",
  });

  if (nowRes.status === 200) {
    const text = await nowRes.text();
    if (text) {
      const data = JSON.parse(text);
      if (data?.is_playing && data?.item) {
        const track = data.item;
        return {
          isPlaying: true,
          configured: true,
          title: track.name,
          artist: track.artists.map((a: { name: string }) => a.name).join(", "),
          album: track.album.name,
          albumArt: track.album.images[0]?.url ?? null,
          songUrl: track.external_urls.spotify,
          progress: data.progress_ms,
          duration: track.duration_ms,
        };
      }
    }
  }

  const recentRes = await fetch(
    "https://api.spotify.com/v1/me/player/recently-played?limit=1",
    { headers, cache: "no-store" }
  );

  if (!recentRes.ok) return { isPlaying: false, configured: true };

  const recentText = await recentRes.text();
  if (!recentText) return { isPlaying: false, configured: true };

  const recent = JSON.parse(recentText);
  const track = recent?.items?.[0]?.track;
  if (!track) return { isPlaying: false, configured: true };

  return {
    isPlaying: false,
    configured: true,
    title: track.name,
    artist: track.artists.map((a: { name: string }) => a.name).join(", "),
    album: track.album.name,
    albumArt: track.album.images[0]?.url ?? null,
    songUrl: track.external_urls.spotify,
  };
}

export async function GET() {
  const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
  const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
  const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;

  if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
    return NextResponse.json({ isPlaying: false, configured: false, reason: "missing_env" });
  }

  try {
    // TTL 30s — now-playing bisa cepet berubah, tapi cukup untuk meredam rate-limit
    const data = await withCache<SpotifyResponse>("spotify:now", 30, () =>
      fetchSpotify(CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN)
    );
    return NextResponse.json(data);
  } catch (err) {
    console.error("[spotify]", err);
    return NextResponse.json({ isPlaying: false, configured: false });
  }
}
