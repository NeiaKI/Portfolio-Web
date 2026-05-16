import { ExternalLink, Award, CalendarDays } from "lucide-react";
import type { Certificate } from "@/types/database";

const ISSUER_COLORS: Record<string, string> = {
  "Amazon Web Services": "text-orange-400",
  "Vercel": "text-foreground",
  "Udemy": "text-purple-400",
  "Linux Foundation": "text-blue-400",
  "CG Cookie": "text-green-400",
  "pganalyze": "text-blue-400",
  "Dicoding": "text-green-400",
  "Google": "text-yellow-400",
  "Microsoft": "text-blue-400",
};

export function CertificateCard({ certificate }: { certificate: Certificate }) {
  const date = new Date(certificate.issued_date).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  const issuerColor = ISSUER_COLORS[certificate.issuer] ?? "text-primary";

  const inner = (
    <div className="group flex gap-3 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/30 hover:bg-card/80 cursor-pointer">
      {/* Logo / Icon */}
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-muted overflow-hidden">
        {certificate.thumbnail_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={certificate.thumbnail_url}
            alt={certificate.issuer}
            className="h-8 w-8 object-contain"
          />
        ) : (
          <Award className={`h-5 w-5 ${issuerColor}`} />
        )}
      </div>

      {/* Text */}
      <div className="flex flex-1 flex-col gap-0.5 min-w-0">
        <p className="font-medium text-sm text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {certificate.title}
        </p>
        <p className={`text-xs font-medium ${issuerColor}`}>{certificate.issuer}</p>
        <span className="flex items-center gap-1 text-[11px] text-muted-foreground mt-0.5">
          <CalendarDays className="h-3 w-3" />
          {date}
        </span>
      </div>

      {/* Link icon */}
      {certificate.certificate_url && (
        <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground/30 group-hover:text-primary/60 transition-colors mt-0.5" />
      )}
    </div>
  );

  return certificate.certificate_url ? (
    <a href={certificate.certificate_url} target="_blank" rel="noopener noreferrer" aria-label={`View certificate: ${certificate.title}`}>
      {inner}
    </a>
  ) : (
    <div>{inner}</div>
  );
}
