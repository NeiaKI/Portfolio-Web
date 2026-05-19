import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

function buildCSP(nonce: string): string {
  const isDev = process.env.NODE_ENV === "development";

  const directives = [
    // Fallback: tolak semua yang tidak tercakup direktif lain
    "default-src 'self'",

    // Scripts: hanya self + nonce'd scripts.
    // 'strict-dynamic' → script yang dimuat oleh nonce'd script (Next.js chunks) juga dipercaya
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,

    // Styles: 'unsafe-inline' diperlukan untuk React inline styles (style={{ ... }})
    // dan Framer Motion — tidak bisa dihindari tanpa refactor besar
    "style-src 'self' 'unsafe-inline'",

    // Gambar: termasuk domain dari widget yang pakai <img> langsung (bukan next/image)
    [
      "img-src 'self' data: blob:",
      "https://i.scdn.co",           // Spotify album art
      "https://mosaic.scdn.co",      // Spotify mosaic art
      "https://cdn.simpleicons.org", // Duolingo icon di widget
      "https://covers.openlibrary.org", // Book cover di NowReading
      "https://opengraph.githubassets.com", // GitHub OG (project fallback)
      "https://image.thum.io",       // Project thumbnail fallback
      "https://avatars.githubusercontent.com",
      "https://images.unsplash.com",
      "https://res.cloudinary.com",
    ].join(" "),

    // Font: next/font melayani font dari /_next/static (same origin)
    "font-src 'self'",

    // Fetch / XHR: tambahkan endpoint react-github-calendar
    "connect-src 'self' https://github-contributions-api.jogruber.de",

    // Tidak ada media embed
    "media-src 'none'",

    // Tidak ada plugin (Flash, dll)
    "object-src 'none'",

    // Lindungi base tag dari inject
    "base-uri 'self'",

    // Lindungi form action dari inject
    "form-action 'self'",

    // Larang semua iframe embedding (sudah ada X-Frame-Options: DENY juga)
    "frame-ancestors 'none'",

    // Upgrade HTTP → HTTPS (skip di dev karena localhost pakai HTTP)
    ...(isDev ? [] : ["upgrade-insecure-requests"]),
  ];

  return directives.join("; ");
}

export function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const csp = buildCSP(nonce);

  // Jalankan intl middleware untuk handle locale redirect dan cookie
  const intlResponse = intlMiddleware(request);

  // Kalau intl ingin redirect (misal / → /en), cukup tempel CSP dan return
  if (intlResponse.status >= 300 && intlResponse.status < 400) {
    intlResponse.headers.set("Content-Security-Policy", csp);
    return intlResponse;
  }

  // Untuk render normal: inject nonce ke request headers agar bisa dibaca
  // server component via headers(). Next.js otomatis pakai x-nonce untuk
  // framework scripts (hydration, __NEXT_DATA__, dll).
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  // Salin headers dari intl response (locale cookie, dll)
  intlResponse.headers.forEach((value, key) => {
    response.headers.set(key, value);
  });

  response.headers.set("Content-Security-Policy", csp);

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
