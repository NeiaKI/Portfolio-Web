import { getTranslations } from "next-intl/server";
import { MainLayout } from "@/components/layout/main-layout";
import { ProjectList } from "@/components/project/project-list";
import { getGithubProjectsCached } from "@/lib/github";
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
  const projects = await getGithubProjectsCached().catch(() => []);

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
