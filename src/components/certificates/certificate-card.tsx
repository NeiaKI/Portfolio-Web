"use client";

import { useState } from "react";
import { ExternalLink, X, Calendar, Hash, Building2 } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
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
          loading="lazy"
          decoding="async"
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

function CertificateDetail({ certificate }: { certificate: Certificate }) {
  const date = new Date(certificate.issued_date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
      <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-card p-6 shadow-2xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
        {/* Close button */}
        <Dialog.Close className="absolute right-4 top-4 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
          <X className="h-4 w-4" />
        </Dialog.Close>

        {/* Header */}
        <div className="flex items-start gap-4 pr-8">
          <IssuerLogo src={certificate.thumbnail_url} issuer={certificate.issuer} />
          <div className="flex flex-col gap-1 min-w-0">
            <Dialog.Title className="text-base font-semibold text-foreground leading-snug">
              {certificate.title}
            </Dialog.Title>
            <Dialog.Description className="text-sm text-muted-foreground">
              {certificate.issuer}
            </Dialog.Description>
          </div>
        </div>

        {/* Details */}
        <div className="mt-5 flex flex-col gap-3">
          <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 shrink-0" />
            <span>{date}</span>
          </div>
          {certificate.credential_id && (
            <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
              <Hash className="h-4 w-4 shrink-0" />
              <span className="font-mono text-xs">{certificate.credential_id}</span>
            </div>
          )}
          <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
            <Building2 className="h-4 w-4 shrink-0" />
            <span>{certificate.issuer}</span>
          </div>
        </div>

        {/* Footer note */}
        <p className="mt-5 rounded-lg bg-muted/60 px-3 py-2 text-xs text-muted-foreground">
          Verification link not available for this certificate.
        </p>
      </Dialog.Content>
    </Dialog.Portal>
  );
}

export function CertificateCard({ certificate }: { certificate: Certificate }) {
  const date = new Date(certificate.issued_date).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  const hasUrl = !!certificate.certificate_url;

  const inner = (
    <div className="group flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-sm cursor-pointer">
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

      <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted-foreground/40 transition-colors group-hover:text-primary" />
    </div>
  );

  if (hasUrl) {
    return (
      <a
        href={certificate.certificate_url!}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`View certificate: ${certificate.title}`}
      >
        {inner}
      </a>
    );
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button type="button" className="w-full text-left" aria-label={`View details: ${certificate.title}`}>
          {inner}
        </button>
      </Dialog.Trigger>
      <CertificateDetail certificate={certificate} />
    </Dialog.Root>
  );
}
