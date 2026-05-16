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
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="#58cc02">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
        </svg>
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
              <div className="rounded-lg border border-border/60 bg-background/50 p-3 flex flex-col gap-1">
                <Flame className="h-5 w-5 text-orange-500" />
                <p className="text-2xl font-bold text-orange-500">{data.streak.toLocaleString()}</p>
                <p className="text-[11px] text-muted-foreground">Day Streak</p>
              </div>
              <div className="rounded-lg border border-border/60 bg-background/50 p-3 flex flex-col gap-1">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <p className="text-2xl font-bold text-yellow-500">{data.totalXp.toLocaleString()}</p>
                <p className="text-[11px] text-muted-foreground">Total XP</p>
              </div>
              <div className="rounded-lg border border-border/60 bg-background/50 p-3 flex flex-col gap-1">
                <BookOpen className="h-5 w-5 text-primary" />
                <p className="text-2xl font-bold text-primary">{data.courses.length}</p>
                <p className="text-[11px] text-muted-foreground">Active Courses</p>
              </div>
            </div>

            {/* Per-course XP */}
            <div className="grid grid-cols-3 gap-3">
              {data.courses.map((course) => (
                <div
                  key={course.lang}
                  className="rounded-lg border border-border/60 bg-background/50 px-3 py-2.5 flex items-center justify-between"
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
