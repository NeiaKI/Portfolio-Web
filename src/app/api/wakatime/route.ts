import { NextResponse } from "next/server";

export const revalidate = 900;

function fmtTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h} hrs ${m} mins`;
  if (m > 0) return `${m} mins`;
  return "0 mins";
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

    const today = new Date().toISOString().split("T")[0];
    const weekAgo = new Date(Date.now() - 7 * 86400_000).toISOString().split("T")[0];

    const [summariesRes, allTimeRes] = await Promise.all([
      fetch(
        `https://wakatime.com/api/v1/users/current/summaries?start=${weekAgo}&end=${today}`,
        { headers, next: { revalidate: 900 } }
      ),
      fetch("https://wakatime.com/api/v1/users/current/all_time_since_today", {
        headers,
        next: { revalidate: 900 },
      }),
    ]);

    if (!summariesRes.ok) throw new Error("WakaTime summaries error");

    const { data: days, start, end } = await summariesRes.json() as {
      data: Array<{
        range: { date: string };
        grand_total: { total_seconds: number };
        languages: Array<{ name: string; percent: number }>;
        categories: Array<{ name: string; percent: number }>;
      }>;
      start: string;
      end: string;
    };

    const allTime = allTimeRes.ok ? (await allTimeRes.json()).data : null;

    // Aggregate totals from summaries
    const totalSeconds = days.reduce((s, d) => s + (d.grand_total?.total_seconds ?? 0), 0);
    const activeDays = days.filter((d) => (d.grand_total?.total_seconds ?? 0) > 0);
    const avgSeconds = activeDays.length > 0 ? totalSeconds / activeDays.length : 0;

    const bestDay = days.reduce(
      (best, d) =>
        (d.grand_total?.total_seconds ?? 0) > (best.grand_total?.total_seconds ?? 0) ? d : best,
      days[0]
    );

    // Aggregate languages + categories weighted by day total seconds
    const langMap = new Map<string, number>();
    const catMap = new Map<string, number>();

    for (const day of days) {
      const dayTotal = day.grand_total?.total_seconds ?? 0;
      if (dayTotal === 0) continue;
      for (const l of day.languages ?? []) {
        langMap.set(l.name, (langMap.get(l.name) ?? 0) + (l.percent / 100) * dayTotal);
      }
      for (const c of day.categories ?? []) {
        catMap.set(c.name, (catMap.get(c.name) ?? 0) + (c.percent / 100) * dayTotal);
      }
    }

    const toPercents = (map: Map<string, number>, limit?: number) => {
      const total = Array.from(map.values()).reduce((a, b) => a + b, 0);
      if (total === 0) return [];
      return Array.from(map.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([name, secs]) => ({ name, percent: Math.round((secs / total) * 100) }));
    };

    return NextResponse.json({
      start: fmtDate(start),
      end: fmtDate(end),
      daily_avg: fmtTime(Math.round(avgSeconds)),
      this_week: fmtTime(Math.round(totalSeconds)),
      best_day: bestDay
        ? { date: fmtDate(bestDay.range.date), time: fmtTime(bestDay.grand_total.total_seconds ?? 0) }
        : { date: "—", time: "—" },
      all_time: allTime?.text ?? fmtTime(Math.round(totalSeconds)),
      languages: toPercents(langMap, 5),
      categories: toPercents(catMap),
    });
  } catch {
    return NextResponse.json(MOCK);
  }
}
