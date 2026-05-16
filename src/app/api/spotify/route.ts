import { NextResponse } from "next/server";

export const revalidate = 60; // 1 min

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;

async function getAccessToken(): Promise<string> {
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64")}`,
    },
    body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: REFRESH_TOKEN! }),
    cache: "no-store",
  });
  const data = await res.json();
  return data.access_token;
}

export async function GET() {
  if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
    return NextResponse.json({ isPlaying: false, configured: false });
  }

  try {
    const token = await getAccessToken();
    const headers = { Authorization: `Bearer ${token}` };

    const nowRes = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
      headers,
      cache: "no-store",
    });

    if (nowRes.status === 200) {
      const data = await nowRes.json();
      if (data?.is_playing && data?.item) {
        const track = data.item;
        return NextResponse.json({
          isPlaying: true,
          configured: true,
          title: track.name,
          artist: track.artists.map((a: { name: string }) => a.name).join(", "),
          album: track.album.name,
          albumArt: track.album.images[0]?.url ?? null,
          songUrl: track.external_urls.spotify,
          progress: data.progress_ms,
          duration: track.duration_ms,
        });
      }
    }

    // Not playing — fetch recently played
    const recentRes = await fetch(
      "https://api.spotify.com/v1/me/player/recently-played?limit=1",
      { headers, cache: "no-store" }
    );
    const recent = await recentRes.json();
    const track = recent?.items?.[0]?.track;

    if (!track) return NextResponse.json({ isPlaying: false, configured: true });

    return NextResponse.json({
      isPlaying: false,
      configured: true,
      title: track.name,
      artist: track.artists.map((a: { name: string }) => a.name).join(", "),
      album: track.album.name,
      albumArt: track.album.images[0]?.url ?? null,
      songUrl: track.external_urls.spotify,
    });
  } catch {
    return NextResponse.json({ isPlaying: false, configured: false });
  }
}
