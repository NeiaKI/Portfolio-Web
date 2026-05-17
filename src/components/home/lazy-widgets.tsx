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

export function LazyCodingProgress() {
  return <ErrorBoundary><CodingProgress /></ErrorBoundary>;
}

export function LazyDuolingoProgress() {
  return <ErrorBoundary><DuolingoProgress /></ErrorBoundary>;
}

export function LazyMonkeyTypeWidget() {
  return <ErrorBoundary><MonkeyTypeWidget /></ErrorBoundary>;
}
