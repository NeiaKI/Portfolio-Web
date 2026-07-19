import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface BrilliantCourse {
  title: string;
  progress: number;
}

function parseStat(value: string | undefined, max: number): number | null {
  if (!value?.trim()) return null;
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 0 && parsed <= max ? parsed : null;
}

function parseCourses(value: string | undefined): BrilliantCourse[] | null {
  if (!value?.trim()) return null;

  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed) || parsed.length > 12) return null;

    const courses = parsed.filter((course): course is BrilliantCourse => {
      if (!course || typeof course !== "object") return false;
      const item = course as Record<string, unknown>;
      return (
        typeof item.title === "string" &&
        item.title.trim().length > 0 &&
        item.title.length <= 100 &&
        typeof item.progress === "number" &&
        Number.isFinite(item.progress) &&
        item.progress >= 0 &&
        item.progress <= 100
      );
    });

    return courses.length === parsed.length ? courses : null;
  } catch {
    return null;
  }
}

export async function GET() {
  const streak = parseStat(process.env.BRILLIANT_STREAK, 100_000);
  const totalXp = parseStat(process.env.BRILLIANT_TOTAL_XP, 1_000_000_000);
  const lessonsCompleted = parseStat(process.env.BRILLIANT_LESSONS_COMPLETED, 1_000_000);
  const courses = parseCourses(process.env.BRILLIANT_COURSES_JSON);

  if (streak === null || totalXp === null || lessonsCompleted === null || courses === null) {
    return NextResponse.json(
      { error: true },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }

  return NextResponse.json(
    { streak, totalXp, lessonsCompleted, courses },
    {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
      },
    }
  );
}
