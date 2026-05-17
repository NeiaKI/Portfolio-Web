import { getTranslations } from "next-intl/server";
import { MainLayout } from "@/components/layout/main-layout";
import { ProjectList } from "@/components/project/project-list";
import type { Metadata } from "next";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "project" });
  return { title: t("title") };
}

async function getGithubProjects() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/api/github`,
      { cache: "no-store" }
    );
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export default async function ProjectPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "project" });
  const projects = await getGithubProjects();

  return (
    <MainLayout>
      <div className="flex flex-col gap-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>
        <ProjectList projects={projects} locale={locale} />
      </div>
    </MainLayout>
  );
}
