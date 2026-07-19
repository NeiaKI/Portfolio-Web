"use client";

import { useEffect, useRef, useState } from "react";
import { BookOpenCheck, Flame, Sparkles } from "lucide-react";
import { Skeleton, SkeletonStatGrid } from "@/components/ui/skeleton";

interface BrilliantCourse {
  title: string;
  progress: number;
}

interface BrilliantData {
  streak: number;
  totalXp: number;
  lessonsCompleted: number;
  courses: BrilliantCourse[];
}

function useCountUp(target: number, duration: number, active: boolean) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;

    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setValue(Math.round(eased * target));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, duration, target]);

  return value;
}

function CourseProgress({ course }: { course: BrilliantCourse }) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border bg-background px-3 py-2.5 shadow-sm">
      <div className="flex items-center justify-between gap-3 text-xs">
        <span className="truncate font-medium text-foreground">{course.title}</span>
        <span className="shrink-0 tabular-nums text-muted-foreground">{course.progress}%</span>
      </div>
      <div
        role="progressbar"
        aria-label={`${course.title} progress`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={course.progress}
        className="h-1.5 overflow-hidden rounded-full bg-muted"
      >
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-700"
          style={{ width: `${course.progress}%` }}
        />
      </div>
    </div>
  );
}

export default function BrilliantProgress() {
  const [data, setData] = useState<BrilliantData | null>(null);
  const [loading, setLoading] = useState(true);
  const [animStarted, setAnimStarted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/brilliant", { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Brilliant progress unavailable");
        return response.json() as Promise<BrilliantData>;
      })
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const streak = useCountUp(data?.streak ?? 0, 1200, animStarted && !!data);
  const totalXp = useCountUp(data?.totalXp ?? 0, 1400, animStarted && !!data);
  const lessons = useCountUp(data?.lessonsCompleted ?? 0, 1000, animStarted && !!data);

  return (
    <section ref={sectionRef} className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <span className="flex h-5 w-5 items-center justify-center rounded bg-primary/15 text-primary">
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
        <h2 className="text-xl font-bold text-foreground">Brilliant Progress</h2>
      </div>

      <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5">
        {loading ? (
          <>
            <SkeletonStatGrid cols={3} count={3} />
            <div className="grid gap-2 sm:grid-cols-2">
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
            </div>
          </>
        ) : data ? (
          <>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <div className="flex flex-col gap-1 rounded-lg border border-border bg-background p-2.5 shadow-sm sm:p-3">
                <Flame className="h-5 w-5 text-muted-foreground" />
                <p className="text-xl font-bold tabular-nums text-foreground sm:text-2xl">{streak.toLocaleString()}</p>
                <p className="text-[11px] text-muted-foreground">Day Streak</p>
              </div>
              <div className="flex flex-col gap-1 rounded-lg border border-border bg-background p-2.5 shadow-sm sm:p-3">
                <Sparkles className="h-5 w-5 text-primary" />
                <p className="text-xl font-bold tabular-nums text-primary sm:text-2xl">{totalXp.toLocaleString()}</p>
                <p className="text-[11px] text-muted-foreground">Total XP</p>
              </div>
              <div className="flex flex-col gap-1 rounded-lg border border-border bg-background p-2.5 shadow-sm sm:p-3">
                <BookOpenCheck className="h-5 w-5 text-muted-foreground" />
                <p className="text-xl font-bold tabular-nums text-foreground sm:text-2xl">{lessons.toLocaleString()}</p>
                <p className="text-[11px] text-muted-foreground">Lessons Done</p>
              </div>
            </div>

            {data.courses.length > 0 && (
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {data.courses.map((course) => (
                  <CourseProgress key={course.title} course={course} />
                ))}
              </div>
            )}
          </>
        ) : (
          <p className="text-sm text-muted-foreground">Brilliant progress belum dikonfigurasi.</p>
        )}
      </div>
    </section>
  );
}
