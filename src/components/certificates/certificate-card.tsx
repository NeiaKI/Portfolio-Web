import { ExternalLink } from "lucide-react";
import type { Certificate } from "@/types/database";

export function CertificateCard({ certificate }: { certificate: Certificate }) {
  const date = new Date(certificate.issued_date).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  const inner = (
    <div className="group flex items-start gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-border/80 hover:bg-card/70">
      {/* Issuer logo */}
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-muted overflow-hidden">
        {certificate.thumbnail_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={certificate.thumbnail_url}
            alt={certificate.issuer}
            className="h-10 w-10 object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <span className="text-lg font-bold text-muted-foreground">
            {certificate.issuer.charAt(0)}
          </span>
        )}
      </div>

      {/* Text content */}
      <div className="flex flex-1 flex-col gap-0.5 min-w-0 pt-0.5">
        <p className="font-semibold text-sm text-foreground leading-snug">
          {certificate.title}
        </p>
        <p className="text-sm text-muted-foreground">{certificate.issuer}</p>
        <p className="text-sm text-muted-foreground">{date}</p>
      </div>

      {/* External link */}
      <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors mt-0.5" />
    </div>
  );

  return certificate.certificate_url ? (
    <a
      href={certificate.certificate_url}
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
