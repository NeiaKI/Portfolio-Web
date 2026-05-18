"use client";

import dynamic from "next/dynamic";
import { ErrorBoundary } from "@/components/ui/error-boundary";

function SectionSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="flex flex-col gap-3 animate-pulse">
      <div className="h-6 w-40 rounded-lg bg-muted" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-16 rounded-xl bg-muted" />
      ))}
    </div>
  );
}

const SkillsSection = dynamic(
  () => import("@/components/home/skills-section").then((m) => m.SkillsSection),
  {
    ssr: false,
    loading: () => (
      <div className="flex flex-col gap-4 animate-pulse">
        <div className="h-6 w-52 rounded-lg bg-muted" />
        <div className="flex flex-col gap-2">
          <div className="h-9 rounded-full bg-muted" />
          <div className="h-9 rounded-full bg-muted" />
          <div className="h-9 rounded-full bg-muted" />
        </div>
      </div>
    ),
  }
);

const CodingProgress = dynamic(
  () => import("@/components/widgets/coding-progress").then((m) => m.CodingProgress),
  { ssr: false, loading: () => <SectionSkeleton rows={6} /> }
);

const DuolingoProgress = dynamic(
  () => import("@/components/widgets/duolingo-progress").then((m) => m.DuolingoProgress),
  { ssr: false, loading: () => <SectionSkeleton rows={3} /> }
);

const MonkeyTypeWidget = dynamic(
  () => import("@/components/widgets/monkeytype-widget").then((m) => m.MonkeyTypeWidget),
  { ssr: false, loading: () => <SectionSkeleton rows={5} /> }
);

export function LazySkillsSection() {
  return <ErrorBoundary><SkillsSection /></ErrorBoundary>;
}

export function LazyCodingProgress() {
  return <ErrorBoundary><CodingProgress /></ErrorBoundary>;
}

export function LazyDuolingoProgress() {
  return <ErrorBoundary><DuolingoProgress /></ErrorBoundary>;
}

export function LazyMonkeyTypeWidget() {
  return <ErrorBoundary><MonkeyTypeWidget /></ErrorBoundary>;
}
