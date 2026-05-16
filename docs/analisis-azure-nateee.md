# Analisis Website Portfolio — `azure.nateee.com`

> **Tujuan dokumen:** Mengumpulkan seluruh informasi penting dari website target sebagai bahan baku penyusunan PRD (Product Requirement Document) untuk portfolio web Eki.
>
> **Status:** Analisis (Tahap 1 dari 2)
> **Tahap berikutnya:** Penyusunan PRD berbasis temuan ini.

---

## 1. Identitas & Konteks Website

| Aspek | Detail |
|---|---|
| **URL utama** | `https://azure.nateee.com` (subdomain `azure`, domain utama: `nateee.com`) |
| **Pemilik** | Muhammad Rizky Haksono (`@nateenese`) |
| **Posisi** | Software Engineer (Front End / AI Engineer) |
| **Background** | Mahasiswa S1 Ilmu Komputer, UMM (Cum Laude, IPK 3.91/4.00) |
| **Lokasi** | Malang, Indonesia |
| **Locale** | `id-ID` (tapi konten utama dalam bahasa Inggris) |
| **Subdomain `azure`** | Kemungkinan staging/preview branch — domain produksi di `nateee.com` |

**Catatan penting:** Subdomain `azure` menunjukkan kebiasaan deployment multi-environment (mungkin nama dari Cloudflare Pages branch deployment atau pola staging-prod). Ini detail kecil tapi mencerminkan praktik DevOps yang matang.

---

## 2. Tech Stack (Verifikasi dari Wappalyzer + Observasi)

### 2.1. Framework & Library Frontend

| Kategori | Teknologi | Versi/Catatan |
|---|---|---|
| **Framework utama** | Next.js | **16.1.6** (versi terbaru, App Router) |
| **Library UI** | React | (versi mengikuti Next.js 16, kemungkinan React 19) |
| **Build tool** | Turbopack | Bundler default Next.js 16 |
| **Styling** | Tailwind CSS | Utility-first CSS |
| **Component system** | shadcn/ui | Komponen berbasis Radix UI |
| **Headless primitives** | Radix UI | Untuk accessibility & behavior |
| **Animasi** | Framer Motion | Untuk transisi & micro-interactions |
| **Ikon** | Lucide | Set ikon SVG modern |
| **Charts** | Recharts | Untuk grafik (WPM progress, coding stats) |

### 2.2. Backend / Data Layer

| Kategori | Teknologi |
|---|---|
| **BaaS** | Supabase (auth, database, storage) |
| **Database** | PostgreSQL (via Supabase) |
| **Image storage** | Cloudinary + Supabase Storage |
| **CDN/Hosting** | Kemungkinan Vercel (default untuk Next.js, atau bisa juga Cloudflare Pages mengingat subdomain `azure`) |

### 2.3. Optimasi & SEO

- **Open Graph** metadata lengkap (title, description, image, locale, type)
- **Twitter Card** (`summary_large_image`)
- **Priority Hints** (untuk LCP optimization)
- **PWA** aktif (manifest + service worker)
- **RSS feed** tersedia (kemungkinan untuk blog)
- **Image optimization** via `next/image` (lihat URL `_next/image?url=...&w=640&q=75`)

### 2.4. Integrasi API Eksternal (dideteksi dari konten)

| Layanan | Fungsi di Website |
|---|---|
| GitHub API | Contributions graph |
| Duolingo API/Scraper | Progress bahasa (Japanese, English, Korean) |
| WakaTime (kemungkinan) | Statistik coding (1,683 jam total) |
| MonkeyType API | Statistik typing (WPM, accuracy, consistency) |
| Spotify API | Now Playing widget |
| OpenWeatherMap (kemungkinan) | Cuaca real-time |
| Dev.to API | Daftar artikel blog |
| Medium API/RSS | Daftar artikel blog |
| IP Geolocation API | Info pengunjung (IP, lokasi, browser) |
| Google Drive | Hosting CV/Portfolio PDF |

> **Skeptisisme:** Tidak semua integrasi ini wajib. Banyak yang bisa diganti dengan static JSON atau cache lokal untuk MVP. Kita akan tentukan prioritas di PRD.

---

## 3. Struktur Halaman (Routing)

```
/
├── /                    # Home (landing utama)
├── /project             # Daftar project + halaman detail per project
│   └── /project/[id]    # Detail project (route dinamis dengan UUID)
├── /blog                # Daftar artikel (Dev.to + Medium)
│   └── /blog/[slug]     # Detail artikel
├── /auth                # Halaman login (Supabase Auth)
├── /ai                  # Etan AI (fitur AI chatbot kustom)
├── /chat                # Fitur chat (real-time? mungkin pakai Supabase Realtime)
├── /tools               # Kumpulan tools utility
├── /roadmap             # Public roadmap pengembangan website
├── /changelog           # Log perubahan/update
├── /certificates        # Daftar sertifikat lengkap
└── /legal/
    ├── /terms           # Terms of Service
    └── /privacy         # Privacy Policy
```

**Observasi penting:**
- Route project memakai **UUID** sebagai identifier (contoh: `/project/3d44a50e-d626-4bd8-88b5-3b0ac442fdcf`). Ini sinyal kuat bahwa data project disimpan di database (Supabase) dengan primary key UUID, bukan static markdown.
- Halaman `/tools` memakai **query parameter** untuk tab (contoh: `?tab=japanese-quiz`). Ini adalah pola tabbed-interface dengan satu route.

---

## 4. Layout & Komponen UI Utama

### 4.1. Layout Global

Berdasarkan pola yang muncul di setiap halaman, layout website terbagi menjadi:

1. **Sidebar Kiri (Profile Card)**
   - Foto profil (`rizky.jpg`)
   - Nama: "Rizky Haksono"
   - Status: "Online" (indikator dot hijau)
   - Username: `@nateenese`
   - Tombol "Sign in" (mengarah ke `/auth`)
   - Caption: "To access all features and personalization"

2. **Navigation Section (di dalam sidebar)**
   - Group **Main:** Home, Project, Blog
   - Group **Application:** Etan AI, Chat
   - Group **Playground:** Tools, Roadmap
   - Section **Theming:** Dark Mode toggle
   - Status badge: "Open to Work"

3. **Main Content Area** — berubah per halaman

4. **Sidebar Kanan (Widgets)**
   - **Visitor Info:** IP Address, Browser, Location
   - **Status:** "Available for work" / "🚀 Open to opportunities"
   - **Quick Stats:** 15+ Projects, 2+ Years Experience, 20+ Technologies, ∞ Coffee Cups
   - **Spotify** widget (Now Playing)
   - **Weather** widget (suhu, kondisi, humidity, feels-like)

5. **Footer**
   - Copyright © 2026 dengan link ke GitHub
   - Link: Terms of Service, Privacy Policy

### 4.2. Komponen Khas

| Komponen | Lokasi | Catatan |
|---|---|---|
| **Hero Section** | Home | Headline "Hi, I'm Muhammad Rizky Haksono" + typing animation "I'm a \|" |
| **Social Links Bar** | Home | GitHub, LinkedIn, Instagram, Twitter (X) |
| **About Card** | Home | Foto + deskripsi singkat + tombol View CV/Portfolio PDF |
| **Skills Marquee** | Home | 115 skills, 12 kategori, dengan animasi scrolling tak terbatas (terlihat dari duplikasi list) |
| **Work Experience Cards** | Home | Logo perusahaan + posisi + rentang waktu |
| **Education Cards** | Home | Pola sama dengan work experience |
| **GitHub Contributions Heatmap** | Home | Grid kalender ala GitHub |
| **Duolingo Progress Widget** | Home | Day Streak, Total XP, Active Courses (Japanese/English/Korean) |
| **Coding Progress Widget** | Home | Start/End date, Daily Average, Languages breakdown, Categories, kalender bulanan |
| **MonkeyType Performance** | Home | Best WPM, Best Accuracy, Tests Completed, Time Typing + 2 chart (WPM Progress, Accuracy & Consistency) |
| **Certifications Section** | Home | Foto + nama issuer + tanggal + link preview |
| **Project Cards** | /project | Title + deskripsi + tag teknologi + link Website/Source |
| **Blog Cards** | /blog | Tab Dev.to / Medium, judul + excerpt + tombol Read more |
| **Tools Tab Selector** | /tools | Grid tab untuk Japanese Quiz, Anime Generator, Downloader, WPM, Compiler, Postal Code, Web3 Crypto |

### 4.3. Pola Interaksi & UX

- **Dark Mode** sebagai default (terlihat dari tema visual)
- **Toggle Dark/Light** tersedia
- **Authentication-gated personalization** — beberapa fitur baru terbuka setelah login
- **Real-time data** di widget (cuaca, status online, visitor IP)

---

## 5. Konten Inti yang Ditampilkan

### 5.1. Data Profil & Branding

- **Tagline:** "Passionate about web, mobile, cloud, and DevOps development"
- **Fokus utama:** React, Next.js, TypeScript, CI/CD
- **Status:** Open to Work
- **Banner OG image:** Disimpan di Cloudinary

### 5.2. Daftar Skills (115 items, 12 kategori — sebagian terlihat)

Frontend: React, Next.js, TypeScript, JavaScript, Vue.js, Angular, Svelte, HTML5, CSS3, Tailwind CSS, Chakra UI, Material UI, Ant Design, Astro.js
Mobile: Flutter, Kotlin, Java, React Native
Backend: Express.js, Nest.js, Laravel, Spring Boot, Go, ASP.NET, Python, FastAPI
Database: PostgreSQL, MySQL, Data Warehouse
DevOps/Tools: Docker, Git, Portainer, RabbitMQ
AI/ML: RAG, MCP
Design: Figma

### 5.3. Work Experience (7 entri)

PT Bejana Investidata Globalindo (Full Stack Intern, 2024), Freelance (beberapa periode), Informatics Lab UMM (Part-Time, 2022–2025), Venturo Internship (2025), PT NyanHosting (Contract, 2025), Serah Web (CIO, 2025-sekarang), PT Bullion Ecosystem (Front End, 2025), Sarana AI (AI Engineer, 2025-sekarang).

### 5.4. Education (4 entri)

- Infinite Learning Indonesia (Independent Study, 2023)
- University of Muhammadiyah Malang (S1 Computer Science, Cum Laude, 2021–2025)
- AWS Back-End Academy (2025)
- Coding Camp 2025 powered by DBS Foundation (Low Touch, 2025)

### 5.5. Projects (~30 project terdaftar)

Mencakup: Tenar (Organizer & Buyer), Info Gempa, E-Commerce Module Federation, OAuth/SSO, Natee Tracker, Research Hub, Serahweb, Menyou (FE & BE), Uptime Monitoring (v1 & v2), Wedding invitations, SIAKAD Venturo, Short Link, Lab JasLab, iLab, Sirenta, miLab, Jacket Lab Mobile, Green Saver, Apel Manis Kost, Anemia Education, Otakudesu, Chat WebSocket, eCRF Biofarma, Adaro Water Solution, Info Pangan Jakarta, Sevenman, Smart Recycling, MAHATI.

### 5.6. Blog (7+ artikel)

Konten teknis (Elysia.js, Docker, SSR/ISR/CSR Next.js, SDLC, MBKM journey) + soft topic ("Why Men Can't Cry", time management).

### 5.7. Tools yang Tersedia

Japanese Quiz (N5-N1), Anime Generator, Social Media Downloader (TikTok/IG/YT), WPM Test, Online Compiler, Postal Code Lookup, Web3 Crypto Tracker.

---

## 6. Pola Desain & Estetika

### 6.1. Visual Style

- **Tema dominan:** Dark mode dengan aksen warna (kemungkinan biru/ungu untuk action items)
- **Typography:** Sans-serif modern (kemungkinan Inter, Geist, atau system font default Next.js)
- **Layout:** 3-column desktop (sidebar kiri – content – sidebar kanan), kemungkinan stack vertikal di mobile
- **Card-based** untuk hampir semua konten

### 6.2. Pola Brand "Personal Hub"

Website ini **bukan portfolio konvensional**. Ini lebih seperti **personal hub / dashboard pribadi** yang mengintegrasikan:
- CV/Portfolio (project, experience, education)
- Activity tracker (coding, typing, language learning)
- Mini-apps (tools, AI, chat)
- Content (blog)
- Social presence (status, Spotify, weather)

Filosofi ini penting dipertimbangkan untuk PRD: apakah Eki ingin meniru **scope penuh** ini, atau memilih **subset** yang paling relevan?

---

## 7. Hal-Hal Penting untuk Penyusunan PRD

### 7.1. Pertanyaan Kunci yang Perlu Dijawab Eki

1. **Scope:** Apakah Eki ingin meniru semua halaman (Home + Project + Blog + Tools + AI + Chat) atau mulai dari MVP (misalnya hanya Home + Project + Blog dulu)?
2. **Personalization:** Apakah perlu fitur login (Supabase Auth) di MVP?
3. **Tools section:** Tools yang ada di referensi sangat spesifik (Japanese quiz dll). Apakah Eki ingin menggantinya dengan tools yang relevan dengan minat sendiri (Linux, NixOS, 3D assets)?
4. **AI Feature ("Etan AI"):** Ini fitur premium yang butuh integrasi LLM (OpenAI/Anthropic/dll) — apakah masuk MVP atau tahap lanjutan?
5. **Activity widgets (Duolingo, MonkeyType, WakaTime, Spotify, Weather):** Mana yang relevan untuk Eki?

### 7.2. Estimasi Kompleksitas Komponen

| Komponen | Kompleksitas | Catatan |
|---|---|---|
| Layout 3-kolom + dark mode | 🟢 Rendah | shadcn/ui + Tailwind sudah siap pakai |
| Sidebar navigation | 🟢 Rendah | Komponen `Sidebar` shadcn/ui |
| Skills marquee | 🟡 Sedang | Butuh animasi CSS atau Framer Motion |
| Project list + detail | 🟡 Sedang | Butuh Supabase CRUD atau MDX static |
| Blog integration (Dev.to/Medium) | 🟡 Sedang | API call + caching |
| GitHub contributions graph | 🟡 Sedang | Bisa pakai library seperti `react-github-calendar` |
| WakaTime/MonkeyType/Duolingo widgets | 🟠 Tinggi | Butuh API key + scraping/proxy untuk yang tidak punya public API resmi |
| Spotify Now Playing | 🟠 Tinggi | Butuh OAuth flow + refresh token logic |
| Weather widget | 🟢 Rendah | OpenWeatherMap free tier |
| AI chatbot | 🔴 Sangat Tinggi | Butuh LLM API + biaya inference |
| Real-time chat | 🔴 Sangat Tinggi | Supabase Realtime + UI state management |
| Auth + personalization | 🟠 Tinggi | Supabase Auth + RLS policies |

### 7.3. Diferensiasi yang Bisa Eki Tambahkan

Karena Eki punya konteks unik (Arch Linux power user, 3D asset creator dengan Gamma Game Assets, tertarik NixOS), beberapa **diferensiasi** yang bisa menggantikan elemen di referensi:

| Elemen Referensi | Bisa diganti dengan (versi Eki) |
|---|---|
| Duolingo widget | Status NixOS/Arch sync, dotfiles GitHub commits |
| Anime generator tool | 3D model viewer (GLB) untuk asset Gamma Game |
| Japanese quiz | Linux command quiz / shell scripting playground |
| Otakudesu project showcase | Showcase Blender renders |

---

## 8. Risiko & Pertimbangan Teknis

1. **Next.js 16 masih sangat baru (rilis akhir 2025/awal 2026)** — dokumentasi & komunitas mungkin belum sebanyak v14/v15. Perlu cek kompatibilitas library pihak ketiga.
2. **Banyak integrasi API berarti banyak environment variable & rate limit yang harus dikelola.** PRD harus mendefinisikan secret management.
3. **Subdomain `azure` menunjukkan ada strategi preview deployment.** PRD perlu mendefinisikan environment (dev/staging/prod).
4. **Image hosting di Cloudinary** = biaya bandwidth bisa naik. Pertimbangkan Supabase Storage atau next/image native saja.
5. **PWA + RSS** menunjukkan komitmen pada distribusi konten. Pertimbangkan apakah Eki butuh ini di MVP.

---

## 9. Ringkasan untuk Diskusi Sebelum PRD

**Hal yang sudah jelas:**
- Tech stack baseline: Next.js (15/16) + TypeScript + Tailwind + shadcn/ui + Framer Motion + Lucide
- Pola layout: 3-kolom dengan sidebar nav kiri & widget kanan
- Konten inti wajib: Hero, About, Skills, Experience, Education, Projects, Blog

**Hal yang masih perlu keputusan Eki:**
- Scope MVP vs full clone
- Pakai database (Supabase) atau static (MDX)?
- Fitur AI & Chat: in/out scope?
- Widget mana yang dipertahankan vs diadaptasi?
- Personal branding (warna, font, tagline) — apakah ikut atau diganti?

---

**Langkah berikutnya:** Saya akan menanyakan beberapa keputusan kunci di atas, lalu menyusun PRD berdasarkan jawaban Eki.
