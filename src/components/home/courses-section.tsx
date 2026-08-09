"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown, ChevronUp, ExternalLink, GraduationCap } from "lucide-react";
import { COURSES } from "@/data/courses";
import type { Course } from "@/data/courses";

const SORTED = [...COURSES].sort(
  (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
);

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function ProviderLogo({ course }: { course: Course }) {
  const [failed, setFailed] = useState(false);

  if (course.providerLogo && !failed) {
    return (
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white p-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={course.providerLogo}
          alt={course.provider}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-contain"
          onError={() => setFailed(true)}
        />
      </div>
    );
  }

  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-muted">
      <GraduationCap className="h-5 w-5 text-muted-foreground" />
    </div>
  );
}

function CourseItem({ course }: { course: Course }) {
  const t = useTranslations("home");
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col rounded-xl border border-border bg-card transition-colors hover:border-primary/30">
      {/* Header — selalu tampil */}
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        aria-expanded={open}
        aria-label={`${open ? t("showLessCourses") : t("showAllCourses")}: ${course.title}`}
        className="flex w-full items-center gap-3 rounded-xl p-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
      >
        <ProviderLogo course={course} />

        <div className="flex flex-1 flex-col gap-0.5 min-w-0">
          <p className="font-semibold text-sm text-foreground leading-snug line-clamp-2">
            {course.title}
          </p>
          <p className="text-xs text-muted-foreground">{course.provider}</p>
        </div>

        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <ChevronDown className="h-4 w-4" />
        </span>
      </button>

      {/* Detail — tampil saat expand */}
      {open && (
        <div className="flex flex-col gap-3 border-t border-border/60 px-4 pb-4 pt-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
              {t("completedLabel")}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatDate(course.completedAt)}
            </span>
            {course.credentialId && (
              <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
                ID: {course.credentialId}
              </span>
            )}
          </div>

          {course.certificateUrl ? (
            <a
              href={course.certificateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-fit items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
            >
              {t("viewCertificate")}
              <ExternalLink className="h-3 w-3" />
            </a>
          ) : (
            <span className="text-[10px] text-muted-foreground/60 italic">
              {t("certificateUnavailable")}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export function CoursesSection() {
  const t = useTranslations("home");

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-baseline gap-2 flex-wrap">
        <h2 className="text-lg font-semibold text-foreground">{t("coursesTitle")}</h2>
        <span className="text-xs text-muted-foreground">
          ({SORTED.length} {t("coursesTotal")})
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {SORTED.map((course) => (
          <CourseItem key={course.id} course={course} />
        ))}
      </div>
    </section>
  );
}
