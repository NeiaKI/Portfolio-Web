import { NextResponse } from "next/server";

export const revalidate = 1800;

function fmtTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h} hrs ${m} mins`;
  return `${m} mins`;
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

const MOCK = {
  start: "May 09, 2026",
  end: "May 15, 2026",
  daily_avg: "3 hrs 52 mins",
  this_week: "27 hrs 5 mins",
  best_day: { date: "May 12, 2026", time: "6 hrs 14 mins" },
  all_time: "1,421 hrs 38 mins",
  languages: [
    { name: "TypeScript", percent: 38 },
    { name: "Go", percent: 26 },
    { name: "Python", percent: 16 },
    { name: "Bash", percent: 12 },
    { name: "Markdown", percent: 8 },
  ],
  categories: [
    { name: "Coding", percent: 88 },
    { name: "Writing Docs", percent: 9 },
    { name: "Writing Tests", percent: 3 },
  ],
};

export async function GET() {
  const apiKey = process.env.WAKATIME_API_KEY;
  if (!apiKey) return NextResponse.json(MOCK);

  try {
    const encoded = Buffer.from(apiKey).toString("base64");
    const headers = { Authorization: `Basic ${encoded}` };

    const [statsRes, allTimeRes] = await Promise.all([
      fetch("https://wakatime.com/api/v1/users/current/stats/last_7_days", {
        headers,
        next: { revalidate: 1800 },
      }),
      fetch("https://wakatime.com/api/v1/users/current/all_time_since_today", {
        headers,
        next: { revalidate: 1800 },
      }),
    ]);

    if (!statsRes.ok) throw new Error("WakaTime API error");

    const { data: d } = await statsRes.json();
    const allTime = allTimeRes.ok ? (await allTimeRes.json()).data : null;

    return NextResponse.json({
      start: fmtDate(d.start),
      end: fmtDate(d.end),
      daily_avg: fmtTime(d.daily_average ?? 0),
      this_week: fmtTime(d.total_seconds ?? 0),
      best_day: d.best_day
        ? { date: fmtDate(d.best_day.date), time: fmtTime(d.best_day.total_seconds ?? 0) }
        : { date: "—", time: "—" },
      all_time: allTime?.text ?? fmtTime(d.total_seconds_including_other_language ?? 0),
      languages: (d.languages ?? [])
        .slice(0, 5)
        .map((l: { name: string; percent: number }) => ({
          name: l.name,
          percent: Math.round(l.percent),
        })),
      categories: (d.categories ?? []).map((c: { name: string; percent: number }) => ({
        name: c.name,
        percent: Math.round(c.percent),
      })),
    });
  } catch {
    return NextResponse.json(MOCK);
  }
}
