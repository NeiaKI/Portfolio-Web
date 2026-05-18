import { getTranslations } from "next-intl/server";
import { Mail } from "lucide-react";
import { MainLayout } from "@/components/layout/main-layout";
import { ContactForm } from "@/components/contact/contact-form";
import { SOCIAL_LINKS } from "@/lib/social-links";
import type { Metadata } from "next";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return { title: t("title") };
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });

  return (
    <MainLayout>
      <div className="flex flex-col gap-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Left: social links + email */}
          <div className="flex flex-col gap-4 rounded-2xl border border-border/40 bg-card p-6">
            <h2 className="font-semibold text-foreground">{t("connectTitle")}</h2>

            <div className="flex flex-col gap-1">
              {SOCIAL_LINKS.map(({ path, label, href, handle }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-muted"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" fill="currentColor">
                    <path d={path} />
                  </svg>
                  <div className="flex flex-1 flex-col">
                    <span className="text-sm font-medium text-foreground">{label}</span>
                    <span className="text-xs text-muted-foreground">{handle}</span>
                  </div>
                </a>
              ))}
            </div>

            <div className="mt-auto border-t border-border pt-4">
              <p className="mb-2 text-xs text-muted-foreground">{t("preferEmail")}</p>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="select-all text-sm font-medium text-foreground">
                  febieki562@gmail.com
                </span>
              </div>
            </div>
          </div>

          {/* Right: contact form */}
          <ContactForm
            labels={{
              title:              t("formTitle"),
              name:               t("name"),
              email:              t("email"),
              message:            t("message"),
              send:               t("send"),
              sending:            t("sending"),
              success:            t("success"),
              successDesc:        t("successDesc"),
              error:              t("error"),
              namePlaceholder:    t("namePlaceholder"),
              emailPlaceholder:   t("emailPlaceholder"),
              messagePlaceholder: t("messagePlaceholder"),
            }}
          />
        </div>
      </div>
    </MainLayout>
  );
}
