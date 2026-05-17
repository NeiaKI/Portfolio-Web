"use client";

import { useEffect, useState, useRef } from "react";
import { Flame, Trophy, BookOpen } from "lucide-react";
import { SkeletonStatGrid, Skeleton } from "@/components/ui/skeleton";

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

function useCountUp(target: number, duration: number, active: boolean) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    setVal(0);
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - t) ** 3;
      setVal(Math.round(eased * target));
      if (t < 1) requestAnimationFrame(tick);
      else setVal(target);
    };
    requestAnimationFrame(tick);
  }, [active, target, duration]);
  return val;
}

function CourseRow({ course, animStarted }: { course: Course; animStarted: boolean }) {
  const xp = useCountUp(course.xp, 1200, animStarted);
  return (
    <div className="rounded-lg border border-border bg-background px-3 py-2.5 flex items-center justify-between gap-2 shadow-sm">
      <span className="text-sm font-medium text-foreground truncate">{course.title}</span>
      <span className="shrink-0 text-xs text-muted-foreground bg-muted rounded-full px-2 py-0.5 tabular-nums">
        {xp.toLocaleString()} XP
      </span>
    </div>
  );
}

export function DuolingoProgress() {
  const [data, setData] = useState<DuolingoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [animStarted, setAnimStarted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    fetch("/api/duolingo")
      .then((r) => r.json())
      .then((d) => { if (!d.error) setData(d); })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const streak   = useCountUp(data?.streak   ?? 0, 1200, animStarted && !!data);
  const totalXp  = useCountUp(data?.totalXp  ?? 0, 1400, animStarted && !!data);
  const courseCount = useCountUp(data?.courses.length ?? 0, 800, animStarted && !!data);

  return (
    <section ref={sectionRef} className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="https://cdn.simpleicons.org/duolingo/58cc02" className="h-5 w-5" alt="Duolingo" />
        <h2 className="text-xl font-bold text-foreground">Duolingo Progress</h2>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-4">
        {loading ? (
          <>
            <SkeletonStatGrid cols={3} count={3} />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-10 w-full" />
            </div>
          </>
        ) : data ? (
          <>
            {/* Stat cards */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <div className="rounded-lg border border-border bg-background p-2.5 sm:p-3 flex flex-col gap-1 shadow-sm">
                <Flame className="h-5 w-5 text-muted-foreground" />
                <p className="text-xl sm:text-2xl font-bold text-foreground tabular-nums">{streak.toLocaleString()}</p>
                <p className="text-[11px] text-muted-foreground">Day Streak</p>
              </div>
              <div className="rounded-lg border border-border bg-background p-2.5 sm:p-3 flex flex-col gap-1 shadow-sm">
                <Trophy className="h-5 w-5 text-primary" />
                <p className="text-xl sm:text-2xl font-bold text-primary tabular-nums">{totalXp.toLocaleString()}</p>
                <p className="text-[11px] text-muted-foreground">Total XP</p>
              </div>
              <div className="rounded-lg border border-border bg-background p-2.5 sm:p-3 flex flex-col gap-1 shadow-sm">
                <BookOpen className="h-5 w-5 text-muted-foreground" />
                <p className="text-xl sm:text-2xl font-bold text-foreground tabular-nums">{courseCount}</p>
                <p className="text-[11px] text-muted-foreground">Active Courses</p>
              </div>
            </div>

            {/* Per-course XP */}
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3">
              {data.courses.map((course) => (
                <CourseRow key={course.lang} course={course} animStarted={animStarted} />
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
