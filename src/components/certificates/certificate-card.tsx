"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";
import type { Certificate } from "@/types/database";

const BADGE: Record<string, { abbr: string; bg: string; text: string }> = {
  "Frontend Masters": { abbr: "FM", bg: "bg-red-500/15",   text: "text-red-400"   },
  "Dicoding":         { abbr: "DC", bg: "bg-green-500/15", text: "text-green-400" },
};

function IssuerLogo({ src, issuer }: { src: string | null; issuer: string }) {
  const [failed, setFailed] = useState(false);

  const badge = Object.entries(BADGE).find(([k]) => issuer.includes(k))?.[1];

  if (src && !failed) {
    return (
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white p-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={issuer}
          className="h-full w-full object-contain"
          onError={() => setFailed(true)}
        />
      </div>
    );
  }

  const bg   = badge?.bg   ?? "bg-muted";
  const text = badge?.text ?? "text-muted-foreground";
  const abbr = badge?.abbr ?? issuer.charAt(0).toUpperCase();

  return (
    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${bg}`}>
      <span className={`text-[11px] font-bold tracking-tight ${text}`}>{abbr}</span>
    </div>
  );
}

export function CertificateCard({ certificate }: { certificate: Certificate }) {
  const date = new Date(certificate.issued_date).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  const hasUrl = !!certificate.certificate_url;

  const inner = (
    <div className={`group flex items-center gap-3 rounded-xl border bg-card p-4 transition-all ${
      hasUrl
        ? "border-border hover:border-primary/30 hover:shadow-sm cursor-pointer"
        : "border-border/50"
    }`}>
      <IssuerLogo src={certificate.thumbnail_url} issuer={certificate.issuer} />

      <div className="flex flex-1 flex-col gap-0.5 min-w-0">
        <p className="font-semibold text-sm text-foreground leading-snug line-clamp-2">
          {certificate.title}
        </p>
        <p className="text-xs text-muted-foreground">{certificate.issuer}</p>
        <div className="flex items-center gap-2 flex-wrap mt-0.5">
          <span className="text-xs text-muted-foreground">{date}</span>
          {certificate.credential_id && (
            <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
              ID: {certificate.credential_id}
            </span>
          )}
        </div>
      </div>

      <ExternalLink className={`h-3.5 w-3.5 shrink-0 transition-colors ${
        hasUrl
          ? "text-muted-foreground/40 group-hover:text-primary"
          : "text-muted-foreground/20"
      }`} />
    </div>
  );

  return hasUrl ? (
    <a
      href={certificate.certificate_url!}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`View certificate: ${certificate.title}`}
    >
      {inner}
    </a>
  ) : (
    <div>{inner}</div>
  );
}
