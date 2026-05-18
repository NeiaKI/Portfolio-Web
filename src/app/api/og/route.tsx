import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";
export const contentType = "image/png";

const SIZE = { width: 1200, height: 630 };

export function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const title = searchParams.get("title") ?? "Febiyanto Rizki Qurbandi";
  const desc = searchParams.get("desc") ?? "Software Engineer · Linux Enthusiast";
  const tag = searchParams.get("tag") ?? "";

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
        {/* Decorative glow circles */}
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
            background: "radial-gradient(circle, rgba(203,166,247,0.10) 0%, transparent 70%)",
          }}
        />

        {/* Avatar initials */}
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: "#313244",
            border: "3px solid #45475a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 24,
            fontSize: 28,
            fontWeight: 700,
            color: "#cdd6f4",
          }}
        >
          FR
        </div>

        {/* Tag chip (page name) */}
        {tag && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "4px 14px",
              borderRadius: 999,
              border: "1px solid #45475a",
              color: "#89b4fa",
              fontSize: 14,
              marginBottom: 16,
              background: "rgba(137,180,250,0.08)",
            }}
          >
            {tag}
          </div>
        )}

        {/* Title */}
        <div
          style={{
            fontSize: title.length > 40 ? 40 : 52,
            fontWeight: 700,
            color: "#cdd6f4",
            lineHeight: 1.15,
            marginBottom: 16,
            maxWidth: 880,
          }}
        >
          {title}
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: 22,
            color: "#89b4fa",
            marginBottom: 0,
            maxWidth: 760,
          }}
        >
          {desc}
        </div>

        {/* Domain watermark */}
        <div
          style={{
            position: "absolute",
            top: 40,
            right: 80,
            color: "#585b70",
            fontSize: 18,
          }}
        >
          nateeki.dev
        </div>
      </div>
    ),
    { ...SIZE }
  );
}
