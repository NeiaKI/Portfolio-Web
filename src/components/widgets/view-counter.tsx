"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Eye } from "lucide-react";

export function ViewCounter() {
  const [total, setTotal] = useState<number | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // fire-and-forget increment for this page
    fetch("/api/views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pathname }),
    }).catch(() => {});

    // fetch total for display
    fetch("/api/views")
      .then((r) => r.json())
      .then((d) => setTotal(d?.total ?? null))
      .catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (total === null) return null;

  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <Eye className="h-3.5 w-3.5" />
      <span>{total.toLocaleString()} views</span>
    </div>
  );
}
