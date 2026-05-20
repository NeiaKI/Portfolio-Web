import { getTranslations } from "next-intl/server";
import { Heart } from "lucide-react";


import { MainLayout } from "@/components/layout/main-layout";
import { EvmDonate } from "@/components/donate/evm-donate";
import { PlatformCard } from "@/components/donate/platform-card";
import type { Metadata } from "next";

const TRAKTEER_USERNAME = process.env.NEXT_PUBLIC_TRAKTEER_USERNAME ?? "";
const KOFI_USERNAME     = process.env.NEXT_PUBLIC_KOFI_USERNAME     ?? "";
const ETH_ADDRESS       = process.env.NEXT_PUBLIC_ETH_ADDRESS       ?? "";

const TRAKTEER_URL = TRAKTEER_USERNAME ? `https://trakteer.id/${TRAKTEER_USERNAME}` : null;
const KOFI_URL     = KOFI_USERNAME     ? `https://ko-fi.com/${KOFI_USERNAME}`       : null;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "donate" });
  return { title: t("title") };
}


const PLATFORMS = (trakteer: string | null, kofi: string | null) => [
  {
    key: "trakteer",
    name: "Trakteer",
    descKey: "saweriaDesc" as const,
    url: trakteer,
    logo: "/icons/trakteer.svg",
    color: "bg-card border-border hover:border-red-500/30",
    btnColor: "bg-red-600/90 hover:bg-red-600 text-white",
    placeholder: "trakteer.id",
    envKey: "NEXT_PUBLIC_TRAKTEER_USERNAME",
  },
  {
    key: "kofi",
    name: "Ko-fi",
    descKey: "kofiDesc" as const,
    url: kofi,
    logo: "/icons/kofi.svg",
    color: "bg-card border-border hover:border-sky-500/30",
    btnColor: "bg-sky-500/90 hover:bg-sky-500 text-white",
    placeholder: "ko-fi.com",
    envKey: "NEXT_PUBLIC_KOFI_USERNAME",
  },
];

export default async function DonatePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "donate" });
  const platforms = PLATFORMS(TRAKTEER_URL, KOFI_URL);

  return (
    <MainLayout>
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="text-center flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Heart className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>
            <p className="mt-1 text-sm text-muted-foreground max-w-md mx-auto">{t("subtitle")}</p>
          </div>
        </div>

        {/* Fiat platform cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {platforms.map((p) => (
            <PlatformCard
              key={p.key}
              name={p.name}
              logo={p.logo}
              placeholder={p.placeholder}
              desc={t(p.descKey)}
              url={p.url}
              donateLabel={t("donate")}
              envKey={p.envKey}
              color={p.color}
              btnColor={p.btnColor}
            />
          ))}
        </div>

        {/* EVM / Crypto */}
        <EvmDonate
          address={ETH_ADDRESS}
          title={t("evmTitle")}
          desc={t("evmDesc")}
          copyLabel={t("copyAddress")}
          copiedLabel={t("copied")}
          note={t("evmNote")}
        />

      </div>
    </MainLayout>
  );
}
