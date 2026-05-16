import { NextResponse } from "next/server";

export const revalidate = 1800; // 30 min cache

export async function GET() {
  try {
    const res = await fetch(
      "https://wttr.in/Tangerang+Selatan?format=j1",
      { next: { revalidate: 1800 } }
    );
    if (!res.ok) throw new Error("wttr.in error");
    const data = await res.json();
    const current = data.current_condition[0];
    return NextResponse.json({
      temp_c: Number(current.temp_C),
      feels_like_c: Number(current.FeelsLikeC),
      humidity: Number(current.humidity),
      desc: current.weatherDesc[0].value,
      icon: current.weatherIconUrl?.[0]?.value ?? null,
    });
  } catch {
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }
}
