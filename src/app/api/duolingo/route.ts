import { NextResponse } from "next/server";

const USERNAME = "EKI";

export async function GET() {
  try {
    const res = await fetch(
      `https://www.duolingo.com/2017-06-30/users?username=${USERNAME}`,
      {
        headers: { "User-Agent": "Mozilla/5.0", "Accept": "application/json" },
        next: { revalidate: 3600 },
      }
    );
    if (!res.ok) throw new Error("Duolingo fetch failed");
    const data = await res.json();
    const user = data.users?.[0];
    if (!user) throw new Error("User not found");

    return NextResponse.json({
      streak: user.streakData?.currentStreak?.length ?? user.streak ?? 0,
      totalXp: user.totalXp ?? 0,
      courses: (user.courses ?? [])
        .sort((a: { xp: number }, b: { xp: number }) => b.xp - a.xp)
        .map((c: { title: string; xp: number; learningLanguage: string }) => ({
          title: c.title,
          xp: c.xp,
          lang: c.learningLanguage,
        })),
    });
  } catch {
    return NextResponse.json({ error: true }, { status: 500 });
  }
}
