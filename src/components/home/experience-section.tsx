"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const EXPERIENCES = [
  {
    company: "PT. Teknologi Nusantara Digital",
    position: "Full Stack Developer",
    startDate: "2024-03",
    endDate: null,
    logo: null,
    description: "Building and maintaining internal web applications using Next.js, TypeScript, and PostgreSQL. Led the migration from a legacy CMS to a modern headless architecture.",
  },
  {
    company: "Freelance",
    position: "Web & Mobile Developer",
    startDate: "2022-08",
    endDate: "2024-02",
    logo: null,
    description: "Delivered 10+ projects for clients — ranging from company profiles and e-commerce stores to REST APIs and mobile apps. Stack: React, Node.js, Flutter, and Supabase.",
  },
  {
    company: "PT. Solusi Kreatif Indonesia",
    position: "Junior Frontend Developer",
    startDate: "2021-07",
    endDate: "2022-07",
    logo: null,
    description: "Developed UI components and landing pages for SaaS products. Collaborated with the design team to implement Figma designs using React and Tailwind CSS.",
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
