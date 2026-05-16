import { getTranslations } from "next-intl/server";
import { MainLayout } from "@/components/layout/main-layout";
import { ProjectList } from "@/components/project/project-list";
import { getProjects } from "@/lib/data";
import type { Metadata } from "next";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "project" });
  return { title: t("title") };
}

export default async function ProjectPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "project" });
  const projects = await getProjects();

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>
        <ProjectList projects={projects} locale={locale} />
      </div>
    </MainLayout>
  );
}
