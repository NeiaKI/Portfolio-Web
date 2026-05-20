"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { GraduationCap } from "lucide-react";

const EDUCATION = [
  {
    institution: "Universitas Pamulang (UNPAM)",
    degree: "S1 Teknik Informatika",
    startDate: "2023-09",
    endDate: null,
    gpa: "3.55",
    description: "Accredited B program at UNPAM Viktor Campus, Tangerang Selatan. Focused on software engineering, algorithms, and system development.",
    logo: "/images/education/unpam.png",
  },
  {
    institution: "SMA Negeri 10 Tangerang Selatan",
    degree: "Ilmu Pengetahuan Sosial (IPS)",
    startDate: "2018-07",
    endDate: "2021-06",
    description: "Accredited A state high school in Bintaro Sector 9, Ciputat. Focused on economics, sociology, geography, and history.",
    logo: "/images/education/sman10-tangsel.png",
  },
];

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

export function EducationSection() {
  const t = useTranslations("home");

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-foreground">{t("educationTitle")}</h2>
      <div className="flex flex-col gap-3">
        {EDUCATION.map((edu, i) => (
          <div
            key={i}
            className="flex gap-3 rounded-xl border border-border bg-card p-4"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white overflow-hidden">
              {edu.logo ? (
                <Image
                  src={edu.logo}
                  alt={edu.institution}
                  width={40}
                  height={40}
                  className="h-10 w-10 object-contain p-0.5"
                />
              ) : (
                <GraduationCap className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-medium text-sm text-foreground">
                {edu.degree}
              </span>
              <span className="text-xs text-primary">{edu.institution}</span>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-muted-foreground">
                  {formatDate(edu.startDate)} — {edu.endDate ? formatDate(edu.endDate) : t("presentLabel")}
                </span>
                {"gpa" in edu && edu.gpa && (
                  <span className="text-[10px] font-medium text-primary/80 bg-primary/10 rounded px-1.5 py-0.5">
                    GPA {edu.gpa}
                  </span>
                )}
              </div>
              {edu.description && (
                <p className="mt-1 text-xs text-muted-foreground">
                  {edu.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
