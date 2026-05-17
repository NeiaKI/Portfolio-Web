"use client";

import { useEffect, useState } from "react";
import { Flame, Trophy, BookOpen } from "lucide-react";

interface Course {
  title: string;
  xp: number;
  lang: string;
}

interface DuolingoData {
  streak: number;
  totalXp: number;
  courses: Course[];
}

export function DuolingoProgress() {
  const [data, setData] = useState<DuolingoData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/duolingo")
      .then((r) => r.json())
      .then((d) => { if (!d.error) setData(d); })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="https://cdn.simpleicons.org/duolingo/58cc02" className="h-5 w-5" alt="Duolingo" />
        <h2 className="text-xl font-bold text-foreground">Duolingo Progress</h2>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-4">
        {loading ? (
          <div className="grid grid-cols-3 gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-20 rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        ) : data ? (
          <>
            {/* Stat cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg border border-border bg-background p-3 flex flex-col gap-1 shadow-sm">
                <Flame className="h-5 w-5 text-muted-foreground" />
                <p className="text-2xl font-bold text-foreground">{data.streak.toLocaleString()}</p>
                <p className="text-[11px] text-muted-foreground">Day Streak</p>
              </div>
              <div className="rounded-lg border border-border bg-background p-3 flex flex-col gap-1 shadow-sm">
                <Trophy className="h-5 w-5 text-primary" />
                <p className="text-2xl font-bold text-primary">{data.totalXp.toLocaleString()}</p>
                <p className="text-[11px] text-muted-foreground">Total XP</p>
              </div>
              <div className="rounded-lg border border-border bg-background p-3 flex flex-col gap-1 shadow-sm">
                <BookOpen className="h-5 w-5 text-muted-foreground" />
                <p className="text-2xl font-bold text-foreground">{data.courses.length}</p>
                <p className="text-[11px] text-muted-foreground">Active Courses</p>
              </div>
            </div>

            {/* Per-course XP */}
            <div className="grid grid-cols-3 gap-3">
              {data.courses.map((course) => (
                <div
                  key={course.lang}
                  className="rounded-lg border border-border bg-background px-3 py-2.5 flex items-center justify-between shadow-sm"
                >
                  <span className="text-sm font-medium text-foreground">{course.title}</span>
                  <span className="text-xs text-muted-foreground bg-muted rounded-full px-2 py-0.5">
                    {course.xp.toLocaleString()} XP
                  </span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">Duolingo data unavailable.</p>
        )}
      </div>
    </section>
  );
}
