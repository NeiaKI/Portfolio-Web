import { MainLayout } from "@/components/layout/main-layout";
import type { Metadata } from "next";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return { title: locale === "id" ? "Kebijakan Privasi" : "Privacy Policy" };
}

const UPDATED = "2026-05-20";

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  const id = locale === "id";

  return (
    <MainLayout>
      <article className="prose-sm flex max-w-2xl flex-col gap-5 text-sm leading-relaxed text-muted-foreground">
        <header className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-foreground">{id ? "Kebijakan Privasi" : "Privacy Policy"}</h1>
          <p className="text-xs text-muted-foreground/70">
            {id ? "Terakhir diperbarui" : "Last updated"}: {UPDATED}
          </p>
        </header>

        <Section title={id ? "1. Data yang Dikumpulkan" : "1. Data We Collect"}>
          {id
            ? "Situs ini adalah portfolio personal dan tidak meminta registrasi akun. Data yang mungkin dikumpulkan terbatas pada: (a) jumlah view per artikel blog (anonim, dihitung per alamat IP untuk mencegah spam), (b) isi formulir kontak yang kamu kirim secara sukarela, dan (c) preferensi tema serta bahasa yang disimpan di localStorage browser kamu."
            : "This site is a personal portfolio and does not require account registration. Data that may be collected is limited to: (a) per-article blog view counts (anonymous, deduplicated by IP to prevent spam), (b) contact form content you voluntarily submit, and (c) theme and language preferences stored in your browser's localStorage."}
        </Section>

        <Section title={id ? "2. Layanan Pihak Ketiga" : "2. Third-Party Services"}>
          {id
            ? "Beberapa konten ditampilkan via API pihak ketiga: Spotify (lagu yang sedang diputar), WakaTime (statistik coding), GitHub (aktivitas repo), serta data pasar dari CoinGecko dan Yahoo Finance. Penyimpanan data menggunakan Supabase. Layanan-layanan ini punya kebijakan privasi masing-masing."
            : "Some content is displayed via third-party APIs: Spotify (now playing), WakaTime (coding stats), GitHub (repo activity), and market data from CoinGecko and Yahoo Finance. Data storage uses Supabase. These services have their own privacy policies."}
        </Section>

        <Section title={id ? "3. Cookies & Penyimpanan Lokal" : "3. Cookies & Local Storage"}>
          {id
            ? "Situs ini tidak menggunakan cookie pelacakan iklan. Hanya cookie fungsional (deteksi bahasa via next-intl) dan localStorage untuk menyimpan preferensi tema gelap/terang."
            : "This site does not use advertising tracking cookies. Only functional cookies (language detection via next-intl) and localStorage for saving your dark/light theme preference."}
        </Section>

        <Section title={id ? "4. Formulir Kontak" : "4. Contact Form"}>
          {id
            ? "Saat kamu mengirim pesan lewat halaman kontak, nama, email, dan pesan kamu diteruskan ke penyedia layanan formulir untuk dikirim ke pemilik situs. Data ini hanya dipakai untuk membalas pesanmu."
            : "When you send a message via the contact page, your name, email, and message are forwarded to a form service provider to reach the site owner. This data is used solely to respond to your message."}
        </Section>

        <Section title={id ? "5. Hak Kamu" : "5. Your Rights"}>
          {id
            ? "Karena situs ini tidak menyimpan profil pengguna, tidak ada akun untuk dihapus. Untuk pertanyaan terkait data, hubungi pemilik situs lewat halaman kontak."
            : "Since this site does not store user profiles, there is no account to delete. For data-related questions, contact the site owner via the contact page."}
        </Section>

        <Section title={id ? "6. Perubahan" : "6. Changes"}>
          {id
            ? "Kebijakan ini dapat berubah sewaktu-waktu. Tanggal pembaruan terakhir tertera di atas."
            : "This policy may change at any time. The last updated date is shown above."}
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
