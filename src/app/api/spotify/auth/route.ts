import { NextResponse } from "next/server";

// One-time OAuth setup. Visit /api/spotify/auth to authorize your Spotify account.
export async function GET() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json({ error: "SPOTIFY_CLIENT_ID not set" }, { status: 400 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const redirectUri = `${baseUrl}/api/spotify/callback`;
  const scopes = "user-read-currently-playing user-read-recently-played";

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    redirect_uri: redirectUri,
    scope: scopes,
  });

  return NextResponse.redirect(`https://accounts.spotify.com/authorize?${params}`);
}
