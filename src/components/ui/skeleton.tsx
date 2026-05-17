import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

function SkeletonStatGrid({ cols = 3, count = 6 }: { cols?: number; count?: number }) {
  return (
    <div className={cn("grid gap-3", cols === 2 ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-3")}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-lg border border-border bg-background p-3 flex flex-col gap-2 shadow-sm">
          <Skeleton className="h-4 w-4 rounded-md" />
          <Skeleton className="h-7 w-2/3" />
          <Skeleton className="h-3 w-full" />
        </div>
      ))}
    </div>
  );
}

export { Skeleton, SkeletonStatGrid }
