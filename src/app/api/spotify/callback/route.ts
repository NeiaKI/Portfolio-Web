import { NextRequest, NextResponse } from "next/server";

// Exchange the auth code for a refresh_token.
// Copy the returned refresh_token into .env.local as SPOTIFY_REFRESH_TOKEN.
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  if (!code) {
    return NextResponse.json({ error: "No code returned from Spotify" }, { status: 400 });
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID!;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const redirectUri = `${baseUrl}/api/spotify/callback`;

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
    },
    body: new URLSearchParams({ grant_type: "authorization_code", code, redirect_uri: redirectUri }),
  });

  const data = await res.json();

  if (!data.refresh_token) {
    return NextResponse.json({ error: "Failed to get refresh_token", detail: data }, { status: 400 });
  }

  return NextResponse.json({
    message: "✅ Copy this refresh_token into your .env.local as SPOTIFY_REFRESH_TOKEN",
    refresh_token: data.refresh_token,
  });
}
