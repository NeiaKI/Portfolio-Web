import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "avatars.githubusercontent.com" },
      { hostname: "res.cloudinary.com" },
      { hostname: "images.unsplash.com" },
      { hostname: "image.thum.io" },
      { hostname: "opengraph.githubassets.com" },
    ],
  },
};

export default withNextIntl(nextConfig);
