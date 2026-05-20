import { MainLayout } from "@/components/layout/main-layout";
import type { Metadata } from "next";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return { title: locale === "id" ? "Ketentuan Layanan" : "Terms of Service" };
}

const UPDATED = "2026-05-20";

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  const id = locale === "id";

  return (
    <MainLayout>
      <article className="flex max-w-2xl flex-col gap-5 text-sm leading-relaxed text-muted-foreground">
        <header className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-foreground">{id ? "Ketentuan Layanan" : "Terms of Service"}</h1>
          <p className="text-xs text-muted-foreground/70">
            {id ? "Terakhir diperbarui" : "Last updated"}: {UPDATED}
          </p>
        </header>

        <Section title={id ? "1. Penerimaan Ketentuan" : "1. Acceptance of Terms"}>
          {id
            ? "Dengan mengakses dan menggunakan situs ini, kamu menyetujui ketentuan di bawah ini. Jika tidak setuju, mohon untuk tidak menggunakan situs."
            : "By accessing and using this site, you agree to the terms below. If you do not agree, please do not use the site."}
        </Section>

        <Section title={id ? "2. Hak Kekayaan Intelektual" : "2. Intellectual Property"}>
          {id
            ? "Seluruh konten — teks, kode, desain, dan tulisan blog — adalah milik Febiyanto Rizki Qurbandi kecuali disebutkan lain. Kamu boleh melihat dan membaca untuk keperluan pribadi, tetapi tidak boleh menyalin atau mendistribusikan ulang tanpa izin."
            : "All content — text, code, design, and blog posts — belongs to Febiyanto Rizki Qurbandi unless stated otherwise. You may view and read for personal use, but may not copy or redistribute without permission."}
        </Section>

        <Section title={id ? "3. Disclaimer Data Pasar" : "3. Market Data Disclaimer"}>
          {id
            ? "Halaman Tools menampilkan data pasar (crypto, saham AS, saham Indonesia) dari penyedia pihak ketiga (CoinGecko, Yahoo Finance), murni untuk tujuan informasi. Data dapat tertunda atau tidak akurat. INI BUKAN NASIHAT KEUANGAN. Keputusan investasi sepenuhnya tanggung jawab kamu — selalu lakukan riset sendiri."
            : "The Tools page displays market data (crypto, US stocks, Indonesian stocks) from third-party providers (CoinGecko, Yahoo Finance) purely for informational purposes. Data may be delayed or inaccurate. THIS IS NOT FINANCIAL ADVICE. Investment decisions are entirely your responsibility — always do your own research."}
        </Section>

        <Section title={id ? "4. Tautan Eksternal" : "4. External Links"}>
          {id
            ? "Situs ini berisi tautan ke layanan eksternal (GitHub, demo project, artikel, sumber data). Pemilik situs tidak bertanggung jawab atas konten atau kebijakan situs pihak ketiga."
            : "This site contains links to external services (GitHub, project demos, articles, data sources). The site owner is not responsible for the content or policies of third-party sites."}
        </Section>

        <Section title={id ? "5. Batasan Tanggung Jawab" : "5. Limitation of Liability"}>
          {id
            ? "Situs ini disediakan 'sebagaimana adanya' tanpa jaminan apa pun. Pemilik situs tidak bertanggung jawab atas kerugian yang timbul dari penggunaan situs ini."
            : "This site is provided 'as is' without any warranty. The site owner is not liable for any damages arising from use of this site."}
        </Section>

        <Section title={id ? "6. Perubahan Ketentuan" : "6. Changes to Terms"}>
          {id
            ? "Ketentuan ini dapat diperbarui sewaktu-waktu. Penggunaan situs yang berkelanjutan berarti kamu menerima ketentuan terbaru."
            : "These terms may be updated at any time. Continued use of the site means you accept the latest terms."}
        </Section>
      </article>
    </MainLayout>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-1.5">
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      <p>{children}</p>
    </section>
  );
}
