import { ExternalLink, Award } from "lucide-react";
import type { Certificate } from "@/types/database";

interface CertificateCardProps {
  certificate: Certificate;
}

export function CertificateCard({ certificate }: CertificateCardProps) {
  const date = new Date(certificate.issued_date).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/30">
      {/* Thumbnail / Icon */}
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-muted">
        {certificate.thumbnail_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={certificate.thumbnail_url}
            alt={certificate.issuer}
            className="h-8 w-8 object-contain"
          />
        ) : (
          <Award className="h-6 w-6 text-primary" />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-0.5 min-w-0">
        <p className="font-medium text-sm text-foreground leading-snug line-clamp-2">
          {certificate.title}
        </p>
        <p className="text-xs text-primary">{certificate.issuer}</p>
        <p className="text-[11px] text-muted-foreground">{date}</p>
      </div>

      {certificate.certificate_url && (
        <a
          href={certificate.certificate_url}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 text-muted-foreground hover:text-primary transition-colors"
          aria-label={`View certificate: ${certificate.title}`}
        >
          <ExternalLink className="h-4 w-4" />
        </a>
      )}
    </div>
  );
}
