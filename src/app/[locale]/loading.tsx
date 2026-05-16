import { MainLayout } from "@/components/layout/main-layout";

function SkeletonBlock({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-muted ${className ?? ""}`} />;
}

export default function Loading() {
  return (
    <MainLayout>
      <div className="flex flex-col gap-8">
        {/* Hero skeleton */}
        <div className="flex flex-col gap-4 py-6">
          <SkeletonBlock className="h-5 w-28 rounded-full" />
          <SkeletonBlock className="h-10 w-3/4" />
          <SkeletonBlock className="h-5 w-1/2" />
          <SkeletonBlock className="h-4 w-full max-w-xl" />
          <SkeletonBlock className="h-4 w-4/5 max-w-xl" />
          <div className="flex gap-3 pt-2">
            <SkeletonBlock className="h-9 w-32 rounded-full" />
            <SkeletonBlock className="h-9 w-32 rounded-full" />
          </div>
        </div>

        {/* Widget row skeleton */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <SkeletonBlock className="h-32 rounded-xl" />
          <SkeletonBlock className="h-32 rounded-xl" />
        </div>

        {/* Section skeleton */}
        <div className="flex flex-col gap-3">
          <SkeletonBlock className="h-6 w-40" />
          <SkeletonBlock className="h-24 rounded-xl" />
        </div>

        {/* Cards skeleton */}
        <div className="flex flex-col gap-3">
          <SkeletonBlock className="h-6 w-36" />
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <SkeletonBlock key={i} className="h-20 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
