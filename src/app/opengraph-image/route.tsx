import { ImageResponse } from "next/og";

export const runtime = "edge";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-end",
          background: "linear-gradient(135deg, #1e1e2e 0%, #181825 100%)",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: "absolute",
            top: -80,
            right: -80,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(137,180,250,0.15) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            right: 200,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(166,227,161,0.1) 0%, transparent 70%)",
          }}
        />

        {/* Avatar placeholder */}
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "#313244",
            border: "3px solid #45475a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 28,
            fontSize: 32,
            fontWeight: 700,
            color: "#cdd6f4",
          }}
        >
          FR
        </div>

        {/* Name */}
        <div style={{ fontSize: 52, fontWeight: 700, color: "#cdd6f4", lineHeight: 1.1, marginBottom: 16 }}>
          Febiyanto Rizki Qurbandi
        </div>

        {/* Role */}
        <div style={{ fontSize: 24, color: "#89b4fa", marginBottom: 32 }}>
          Software Engineer
        </div>

        {/* Tags */}
        <div style={{ display: "flex", gap: 12 }}>
          {["Next.js", "TypeScript", "Go", "Linux"].map((tag) => (
            <div
              key={tag}
              style={{
                padding: "6px 16px",
                borderRadius: 999,
                border: "1px solid #45475a",
                color: "#a6adc8",
                fontSize: 16,
              }}
            >
              {tag}
            </div>
          ))}
        </div>

        {/* Domain */}
        <div style={{ position: "absolute", top: 40, right: 80, color: "#585b70", fontSize: 18 }}>
          nateeki.dev
        </div>
      </div>
    ),
    { ...size }
  );
}
