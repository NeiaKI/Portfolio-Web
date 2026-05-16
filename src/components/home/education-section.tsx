"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";

const EDUCATION = [
  {
    institution: "Universitas Bina Nusantara (BINUS)",
    degree: "S1 Teknik Informatika",
    startDate: "2020-09",
    endDate: "2024-07",
    description: "Specialization in Software Engineering. Active member of the Programming Club and participated in national competitive programming events.",
  },
  {
    institution: "SMKN 1 Tangerang Selatan",
    degree: "Teknik Komputer dan Jaringan",
    startDate: "2017-07",
    endDate: "2020-06",
    description: "Graduated with distinction. Developed foundational skills in networking, Linux administration, and web development.",
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
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="flex flex-col gap-4"
    >
      <h2 className="text-lg font-semibold text-foreground">{t("educationTitle")}</h2>
      <div className="flex flex-col gap-3">
        {EDUCATION.map((edu, i) => (
          <div
            key={i}
            className="flex gap-3 rounded-xl border border-border bg-card p-4"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
              <GraduationCap className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-medium text-sm text-foreground">
                {edu.degree}
              </span>
              <span className="text-xs text-primary">{edu.institution}</span>
              <span className="text-[11px] text-muted-foreground">
                {formatDate(edu.startDate)} — {formatDate(edu.endDate)}
              </span>
              {edu.description && (
                <p className="mt-1 text-xs text-muted-foreground">
                  {edu.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
