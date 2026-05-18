"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CertificateCard } from "./certificate-card";
import type { Certificate } from "@/types/database";

const PER_PAGE = 10;

export function CertificateList({ certificates }: { certificates: Certificate[] }) {
  const [page, setPage] = useState(1);
  const total = Math.ceil(certificates.length / PER_PAGE);
  const slice = certificates.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 mt-5">
        {slice.map((cert) => (
          <CertificateCard key={cert.id} certificate={cert} />
        ))}
      </div>

      {total > 1 && (
        <div className="flex items-center justify-center gap-3 mt-8">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>

          <span className="rounded-lg border border-border px-4 py-2 text-sm text-foreground">
            Page {page} of {total}
          </span>

          <button
            onClick={() => setPage((p) => Math.min(total, p + 1))}
            disabled={page === total}
            className="flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
