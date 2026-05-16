"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const EXPERIENCES = [
  {
    company: "Your Company",
    position: "Software Engineer",
    startDate: "2024-01",
    endDate: null,
    logo: null,
    description: "Working on full-stack web applications.",
  },
  {
    company: "Freelance",
    position: "Full Stack Developer",
    startDate: "2022-06",
    endDate: "2023-12",
    logo: null,
    description: "Building web projects for clients.",
  },
];

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

export function ExperienceSection() {
  const t = useTranslations("home");

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="flex flex-col gap-4"
    >
      <h2 className="text-lg font-semibold text-foreground">{t("experienceTitle")}</h2>
      <div className="flex flex-col gap-3">
        {EXPERIENCES.map((exp, i) => (
          <div
            key={i}
            className="flex gap-3 rounded-xl border border-border bg-card p-4"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
              <Briefcase className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium text-sm text-foreground">
                  {exp.position}
                </span>
                {!exp.endDate && (
                  <Badge variant="outline" className="border-green-500/30 text-green-500 text-[10px]">
                    {t("presentLabel")}
                  </Badge>
                )}
              </div>
              <span className="text-xs text-primary">{exp.company}</span>
              <span className="text-[11px] text-muted-foreground">
                {formatDate(exp.startDate)} —{" "}
                {exp.endDate ? formatDate(exp.endDate) : t("presentLabel")}
              </span>
              {exp.description && (
                <p className="mt-1 text-xs text-muted-foreground">
                  {exp.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
