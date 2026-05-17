import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Febiyanto Rizki Qurbandi",
    short_name: "nateeki",
    description: "Software Engineer & 3D Artist — portfolio, blog, dan projects",
    start_url: "/",
    display: "standalone",
    background_color: "#1e1e2e",
    theme_color: "#89b4fa",
    icons: [
      { src: "/favicon.ico", sizes: "any", type: "image/x-icon" },
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
