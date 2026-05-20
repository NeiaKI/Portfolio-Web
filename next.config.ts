import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  // HSTS: paksa HTTPS selama 1 tahun, termasuk subdomain
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["lucide-react", "react-icons", "recharts"],
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
  images: {
    remotePatterns: [
      { hostname: "avatars.githubusercontent.com" },
      { hostname: "res.cloudinary.com" },
      { hostname: "images.unsplash.com" },
      { hostname: "image.thum.io" },
      { hostname: "opengraph.githubassets.com" },
      { hostname: "i.scdn.co" },
      { hostname: "mosaic.scdn.co" },
      { hostname: "**.medium.com" },                 // Medium article covers
      { hostname: "**.dev.to" },                      // Dev.to article covers (CDN)
      { hostname: "dev-to-uploads.s3.amazonaws.com" }, // Dev.to article covers (S3)
      { hostname: "coin-images.coingecko.com" },       // Crypto coin icons (market tools)
    ],
  },
};

export default withNextIntl(nextConfig);
