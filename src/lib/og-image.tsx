import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };

export function makeOgImage(title: string, subtitle: string, accent = "#89b4fa") {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%",
          display: "flex", flexDirection: "column",
          alignItems: "flex-start", justifyContent: "flex-end",
          background: "linear-gradient(135deg, #1e1e2e 0%, #181825 100%)",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ position: "absolute", top: -80, right: -80, width: 400, height: 400, borderRadius: "50%", background: `radial-gradient(circle, ${accent}22 0%, transparent 70%)` }} />
        <div style={{ position: "absolute", bottom: 0, right: 200, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(166,227,161,0.08) 0%, transparent 70%)" }} />

        <div style={{ fontSize: 16, color: "#585b70", marginBottom: 20, letterSpacing: 2, textTransform: "uppercase" }}>
          Febiyanto Rizki Qurbandi — nateeki.dev
        </div>
        <div style={{ fontSize: 60, fontWeight: 700, color: "#cdd6f4", lineHeight: 1.1, marginBottom: 16 }}>
          {title}
        </div>
        <div style={{ fontSize: 26, color: accent }}>
          {subtitle}
        </div>

        <div style={{ position: "absolute", top: 40, right: 80, color: "#313244", fontSize: 14 }}>
          nateeki.dev
        </div>
      </div>
    ),
    { ...OG_SIZE }
  );
}
