import { getTranslations } from "next-intl/server";
import { MainLayout } from "@/components/layout/main-layout";
import { MarketDashboard } from "@/components/tools/market-dashboard";
import type { Metadata } from "next";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  return { title: t("tools") };
}

export default async function ToolsPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t("tools")}</h1>
          <p className="text-sm text-muted-foreground">
            {locale === "id"
              ? "Kondisi market 7 hari terakhir — crypto, saham AS, dan saham Indonesia."
              : "Market conditions over the last 7 days — crypto, US stocks, and Indonesian stocks."}
          </p>
        </div>
        <MarketDashboard locale={locale} />
      </div>
    </MainLayout>
  );
}
