import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ArrowLeft, ExternalLink, Code2 } from "lucide-react";
import { MainLayout } from "@/components/layout/main-layout";
import { Badge } from "@/components/ui/badge";
import { Lightbox } from "@/components/ui/lightbox";
import { getProjectBySlug, getProjects } from "@/lib/data";
import type { Metadata } from "next";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
  const projects = await getProjects();
  const locales = ["en", "id"];
  return locales.flatMap((locale) =>
    projects.map((p) => ({ locale, slug: p.slug }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Not Found" };
  return { title: project.title, description: project.description };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "project" });
  const project = await getProjectBySlug(slug);

  if (!project) notFound();

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        {/* Back */}
        <Link
          href={`/${locale}/project`}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("title")}
        </Link>

        {/* Thumbnail */}
        <div className="relative h-56 rounded-xl border border-border bg-muted overflow-hidden">
          {project.thumbnail_url ? (
            <Image
              src={project.thumbnail_url}
              alt={project.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 800px"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Code2 className="h-16 w-16 text-muted-foreground/30" />
            </div>
          )}
        </div>

        {/* Header */}
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <h1 className="text-2xl font-bold text-foreground">{project.title}</h1>
            <div className="flex gap-2">
              {project.website_url && (
                <a
                  href={project.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  {t("viewDemo")}
                </a>
              )}
              {project.source_url && (
                <a
                  href={project.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                >
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  {t("viewSource")}
                </a>
              )}
            </div>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            {project.long_description ?? project.description}
          </p>
        </div>

        {/* Tech stack */}
        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold text-foreground">Tech Stack</h2>
          <div className="flex flex-wrap gap-2">
            {project.tech_stack.map((tech) => (
              <Badge key={tech} variant="outline" className="text-xs">
                {tech}
              </Badge>
            ))}
          </div>
        </div>

        {/* Screenshots */}
        {project.screenshots.length > 0 && (
          <div className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold text-foreground">Screenshots</h2>
            <Lightbox images={project.screenshots} alt={project.title} />
          </div>
        )}
      </div>
    </MainLayout>
  );
}
