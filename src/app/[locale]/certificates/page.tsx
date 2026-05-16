import { getTranslations } from "next-intl/server";
import { MainLayout } from "@/components/layout/main-layout";
import { CertificateList } from "@/components/certificates/certificate-list";
import { getCertificates } from "@/lib/data";
import type { Metadata } from "next";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  return { title: t("certificates") };
}

export default async function CertificatesPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  const certificates = await getCertificates();

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t("certificates")}</h1>
          <p className="text-sm text-muted-foreground">
            {certificates.length} professional certifications and completed courses
          </p>
        </div>
        <CertificateList certificates={certificates} />
      </div>
    </MainLayout>
  );
}
