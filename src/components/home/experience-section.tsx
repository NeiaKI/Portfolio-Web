"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { MapPin, Calendar, Clock, ChevronDown, ChevronUp } from "lucide-react";

interface Experience {
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string | null;
  highlights: string[];
}

const EXPERIENCES: Experience[] = [
  {
    company: "PT. Teknologi Nusantara Digital",
    position: "Full Stack Developer",
    location: "Tangerang Selatan, Banten",
    startDate: "2024-03",
    endDate: null,
    highlights: [
      "Membangun dan memelihara aplikasi web internal menggunakan Next.js, TypeScript, dan PostgreSQL",
      "Memimpin migrasi dari CMS lama ke arsitektur headless modern",
      "Mengimplementasikan CI/CD pipeline dan code review workflow",
      "Berkolaborasi lintas tim untuk delivery fitur dalam sprint 2 mingguan",
    ],
  },
  {
    company: "Freelance",
    position: "Web & Mobile Developer",
    location: "Remote",
    startDate: "2022-08",
    endDate: "2024-02",
    highlights: [
      "Menyelesaikan 10+ proyek klien: company profile, e-commerce, REST API, dan mobile app",
      "Stack utama: React, Node.js, Flutter, dan Supabase",
      "Desain dan implementasi sistem autentikasi dan manajemen database",
      "Pengelolaan proyek end-to-end dari requirement gathering sampai deployment",
    ],
  },
  {
    company: "PT. Solusi Kreatif Indonesia",
    position: "Junior Frontend Developer",
    location: "Jakarta Selatan, DKI Jakarta",
    startDate: "2021-07",
    endDate: "2022-07",
    highlights: [
      "Mengembangkan UI component dan landing page untuk produk SaaS",
      "Kolaborasi dengan tim desain untuk implementasi Figma design ke React + Tailwind CSS",
      "Menulis unit test dan memastikan aksesibilitas (a11y) komponen",
    ],
  },
];

function formatDate(date: string, locale = "en-US") {
  return new Date(date + "-01").toLocaleDateString(locale, {
    month: "short",
    year: "numeric",
  });
}

function getDuration(start: string, end: string | null): string {
  const startDate = new Date(start + "-01");
  const endDate = end ? new Date(end + "-01") : new Date();

  const totalMonths =
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    (endDate.getMonth() - startDate.getMonth());

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  const parts: string[] = [];
  if (years > 0) parts.push(`${years} yr${years > 1 ? "s" : ""}`);
  if (months > 0) parts.push(`${months} mo${months > 1 ? "s" : ""}`);
  return parts.join(" ") || "< 1 mo";
}

function ExperienceItem({ exp, index }: { exp: Experience; index: number }) {
  const [open, setOpen] = useState(false);
  const t = useTranslations("home");
  const isCurrent = !exp.endDate;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="relative flex gap-4 pl-2"
    >
      {/* Timeline dot */}
      <div className="relative flex flex-col items-center">
        <div
          className={`relative z-10 mt-1.5 h-3 w-3 shrink-0 rounded-full border-2 transition-colors ${
            isCurrent
              ? "border-primary bg-primary/30"
              : "border-muted-foreground/40 bg-background"
          }`}
        >
          {isCurrent && (
            <span className="absolute inset-0 rounded-full bg-primary/40 animate-ping" />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1.5 pb-7 flex-1 min-w-0">
        {/* Title */}
        <h3 className="font-semibold text-foreground leading-snug">
          {exp.company}{" "}
          <span className="text-muted-foreground font-normal">—{exp.position}</span>
        </h3>

        {/* Meta */}
        <div className="flex items-center gap-1 flex-wrap text-xs text-muted-foreground">
          <MapPin className="h-3 w-3 shrink-0" />
          <span>{exp.location}</span>
          <span className="mx-1 opacity-40">|</span>
          <Calendar className="h-3 w-3 shrink-0" />
          <span>
            {formatDate(exp.startDate)} — {exp.endDate ? formatDate(exp.endDate) : t("presentLabel")}
          </span>
        </div>

        {/* Duration badge */}
        <div className="flex items-center gap-1 w-fit rounded-full border border-border bg-muted/50 px-2.5 py-0.5 text-[11px] text-muted-foreground">
          <Clock className="h-3 w-3 shrink-0" />
          {getDuration(exp.startDate, exp.endDate)}
        </div>

        {/* Highlights toggle */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-1 w-fit text-[11px] text-muted-foreground hover:text-foreground transition-colors mt-0.5"
        >
          {open ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          {open ? "Hide" : "Show"} highlights ({exp.highlights.length})
        </button>

        {open && (
          <motion.ul
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-1.5 mt-1"
          >
            {exp.highlights.map((h, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary/60" />
                {h}
              </li>
            ))}
          </motion.ul>
        )}
      </div>
    </motion.div>
  );
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

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[13px] top-2 bottom-7 w-px bg-border" />

        <div className="flex flex-col">
          {EXPERIENCES.map((exp, i) => (
            <ExperienceItem key={i} exp={exp} index={i} />
          ))}
        </div>
      </div>
    </motion.section>
  );
}
