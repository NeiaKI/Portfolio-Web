// temp debug
export async function GET() {
  return Response.json({
    hasClientId: !!process.env.SPOTIFY_CLIENT_ID,
    hasClientSecret: !!process.env.SPOTIFY_CLIENT_SECRET,
    hasRefreshToken: !!process.env.SPOTIFY_REFRESH_TOKEN,
    clientIdFirst4: process.env.SPOTIFY_CLIENT_ID?.slice(0, 4),
    nodeEnv: process.env.NODE_ENV,
  });
}
