import { NextResponse } from "next/server";

const USERNAME = "NeiaKI";

interface PBEntry {
  wpm: number;
  raw: number;
  acc: number;
  consistency: number;
  language: string;
}

export async function GET() {
  try {
    const res = await fetch(
      `https://api.monkeytype.com/users/${USERNAME}/profile`,
      {
        headers: { "Accept": "application/json", "User-Agent": "Mozilla/5.0" },
        next: { revalidate: 1800 },
      }
    );
    if (!res.ok) throw new Error("MonkeyType fetch failed");
    const json = await res.json();
    const d = json.data;

    const allPBs: PBEntry[] = Object.values(
      d.personalBests?.time ?? {}
    ).flat() as PBEntry[];

    const bestWpm = allPBs.length ? Math.max(...allPBs.map((p) => p.wpm)) : 0;
    const bestRaw = allPBs.length ? Math.max(...allPBs.map((p) => p.raw)) : 0;
    const bestAcc = allPBs.length ? Math.max(...allPBs.map((p) => p.acc)) : 0;
    const bestConsistency = allPBs.length ? Math.max(...allPBs.map((p) => p.consistency)) : 0;

    const avgWpm = allPBs.length
      ? Math.round(allPBs.reduce((s, p) => s + p.wpm, 0) / allPBs.length)
      : 0;

    const timeTypingSecs = d.typingStats?.timeTyping ?? 0;
    const hours = Math.floor(timeTypingSecs / 3600);
    const mins = Math.floor((timeTypingSecs % 3600) / 60);
    const timeTyping = `${hours}h ${mins}m`;

    // Best WPM per time mode for chart
    const pbByMode = Object.entries(d.personalBests?.time ?? {}).map(
      ([mode, entries]) => {
        const best = (entries as PBEntry[]).reduce(
          (max, e) => (e.wpm > max.wpm ? e : max),
          { wpm: 0, acc: 0, consistency: 0, raw: 0, language: "" }
        );
        return { mode: `${mode}s`, wpm: Math.round(best.wpm), acc: Math.round(best.acc), consistency: Math.round(best.consistency) };
      }
    ).sort((a, b) => parseInt(a.mode) - parseInt(b.mode));

    return NextResponse.json({
      bestWpm: Math.round(bestWpm),
      bestRaw: Math.round(bestRaw),
      bestAcc: Math.round(bestAcc * 10) / 10,
      bestConsistency: Math.round(bestConsistency * 10) / 10,
      avgWpm,
      completedTests: d.typingStats?.completedTests ?? 0,
      startedTests: d.typingStats?.startedTests ?? 0,
      timeTyping,
      streak: d.streak ?? 0,
      pbByMode,
    });
  } catch {
    return NextResponse.json({ error: true }, { status: 500 });
  }
}
