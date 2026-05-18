import Image from "next/image";
import { MainLayout } from "@/components/layout/main-layout";
import type { Metadata } from "next";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isId = locale === "id";
  return {
    title: "Uses",
    description: isId
      ? "Hardware dan software yang saya gunakan sehari-hari — setup lengkap saya."
      : "Hardware and software I use daily — my full setup.",
    openGraph: {
      title: "Uses — Febiyanto Rizki Qurbandi",
      description: isId
        ? "Hardware dan software yang saya gunakan sehari-hari."
        : "Hardware and software I use daily — my full setup.",
      images: [{ url: "/api/og?title=Uses&desc=Hardware+and+software+I+use+daily&tag=Setup", width: 1200, height: 630 }],
    },
  };
}

function A({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary underline underline-offset-2 hover:opacity-80 transition-opacity"
    >
      {children}
    </a>
  );
}

export default async function UsesPage({ params }: Props) {
  const { locale } = await params;
  const id = locale === "id";

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto">
        <article className="prose prose-sm max-w-none dark:prose-invert
          prose-headings:font-bold prose-headings:text-foreground prose-headings:mt-10 prose-headings:mb-4
          prose-p:text-muted-foreground prose-p:leading-relaxed
          prose-li:text-muted-foreground prose-li:leading-relaxed
          prose-a:text-primary prose-a:no-underline hover:prose-a:underline
          prose-strong:text-foreground
          prose-hr:border-border
        ">
          {/* Header */}
          <h1 className="!mt-0 text-2xl">Uses</h1>
          <p>
            {id
              ? <>Inilah breakdown lengkap hardware dan software yang saya gunakan sehari-hari. Terinspirasi dari <A href="https://uses.tech">uses.tech</A>.</>
              : <>Here's a full breakdown of the hardware and software I use daily. Inspired by <A href="https://uses.tech">uses.tech</A>.</>
            }
          </p>

          {/* Desktop screenshot */}
          <div className="not-prose my-8 flex flex-col gap-2">
            <div className="relative overflow-hidden rounded-xl border border-border" style={{ aspectRatio: "16/9" }}>
              <Image
                src="/images/desktop.png"
                alt="My desktop — Arch Linux + Hyprland"
                fill
                className="object-cover"
                priority
              />
            </div>
            <p className="text-center text-xs text-muted-foreground italic">
              {id
                ? "Desktop saya — Arch Linux + Hyprland + Waybar, dengan Catppuccin Mocha di mana-mana."
                : "My desktop — Arch Linux + Hyprland + Waybar, with Catppuccin Mocha everywhere."
              }
            </p>
          </div>

          <hr />

          {/* Hardware */}
          <h2>{id ? "Hardware" : "Hardware"}</h2>
          <ul>
            <li>
              {id ? (
                <>
                  Satu-satunya mesin saya adalah{" "}
                  <A href="https://www.lenovo.com/us/en/p/laptops/thinkpad/thinkpadT/ThinkPad-T480s/22TP2TT480S">
                    Lenovo ThinkPad T480s
                  </A>
                  . Laptop bisnis tipis dan ringan dengan keyboard yang enak, build quality solid, dan kompatibilitas Linux yang baik. T480s berada di titik manis antara portabilitas dan performa — cukup ringan untuk dibawa setiap hari, namun cukup kuat untuk development dan menjalankan Wayland compositor.
                </>
              ) : (
                <>
                  My only machine is a{" "}
                  <A href="https://www.lenovo.com/us/en/p/laptops/thinkpad/thinkpadT/ThinkPad-T480s/22TP2TT480S">
                    Lenovo ThinkPad T480s
                  </A>
                  . It's a thin and light business laptop with a great keyboard,
                  solid build quality, and good Linux compatibility out of the box.
                  The T480s hits the sweet spot between portability and performance —
                  lightweight enough to carry daily, yet powerful enough for
                  development and running a full Wayland compositor.
                </>
              )}
            </li>
          </ul>

          {/* Software */}
          <h2>Software</h2>
          <ul>
            <li>
              {id ? (
                <>Untuk sistem operasi, saya menggunakan <A href="https://archlinux.org">Arch Linux</A> (btw). Tidak menghalangi pekerjaan saya dan sangat minimal serta dapat dikustomisasi sepenuhnya.</>
              ) : (
                <>For my operating system, I use <A href="https://archlinux.org">Arch Linux</A> (btw). It gets out of my way and lets me do my work. Very minimal and customizable.</>
              )}
            </li>
            <li>
              {id ? (
                <><A href="https://hyprland.org">Hyprland</A> adalah window manager saya. Ini adalah Wayland compositor dengan animasi mulus dan tiling layout yang membuat alur kerja saya lebih efisien.</>
              ) : (
                <><A href="https://hyprland.org">Hyprland</A> is my window manager. It's a Wayland compositor with smooth animations and a tiling layout that keeps my workflow efficient.</>
              )}
            </li>
            <li>
              {id ? (
                <><A href="https://github.com/Alexays/Waybar">Waybar</A> adalah status bar di bagian atas — menampilkan workspaces, waktu, cuaca, CPU, RAM, jaringan, dan baterai.</>
              ) : (
                <><A href="https://github.com/Alexays/Waybar">Waybar</A> is the status bar at the top — showing workspaces, time, weather, CPU, RAM, network, and battery.</>
              )}
            </li>
            <li>
              {id ? (
                <>Saya menggunakan dua terminal emulator — <A href="https://ghostty.org">Ghostty</A> sebagai daily driver karena kecepatan dan kesederhanaannya, dan <A href="https://sw.kovidgoyal.net/kitty">Kitty</A> ketika butuh dukungan image protocol. Untuk shell, saya menggunakan <A href="https://www.zsh.org">zsh</A> dengan plugin syntax highlighting dan auto-complete.</>
              ) : (
                <>I use two terminal emulators — <A href="https://ghostty.org">Ghostty</A> as my daily driver for its speed and simplicity, and <A href="https://sw.kovidgoyal.net/kitty">Kitty</A> when I need image protocol support. For my shell, I use <A href="https://www.zsh.org">zsh</A> with plugins for syntax highlighting and auto-complete.</>
              )}
            </li>
            <li>
              {id ? (
                <>Untuk code editor, saya bergantian antara tiga: <A href="https://code.visualstudio.com">VS Code</A> untuk pemakaian umum, <A href="https://cursor.com">Cursor</A> ketika ingin editing berbantuan AI, dan <A href="https://zed.dev">Zed</A> ketika butuh kecepatan — terasa jauh lebih cepat dari yang lain untuk file besar.</>
              ) : (
                <>For code editors, I rotate between three: <A href="https://code.visualstudio.com">VS Code</A> for general use, <A href="https://cursor.com">Cursor</A> when I want AI-assisted editing, and <A href="https://zed.dev">Zed</A> when I need raw speed — it's noticeably faster than the others for large files.</>
              )}
            </li>
            <li>
              {id ? (
                <>Untuk browser, saya terutama menggunakan <A href="https://zen-browser.app">Zen Browser</A> — browser berbasis Firefox dengan UI yang lebih bersih dan manajemen tab yang lebih baik. Saya juga menyimpan <A href="https://github.com/helium-browser/helium">Helium</A> untuk sesi browsing ringan.</>
              ) : (
                <>For my browser, I primarily use <A href="https://zen-browser.app">Zen Browser</A> — a Firefox-based browser with a cleaner UI and better tab management. I also keep <A href="https://github.com/helium-browser/helium">Helium</A> around for lightweight browsing sessions.</>
              )}
            </li>
          </ul>

          {/* Applications */}
          <h2>{id ? "Aplikasi" : "Applications"}</h2>
          <ul>
            <li>
              {id ? (
                <>Untuk version control dan hosting, saya menggunakan <A href="https://github.com">GitHub</A>.</>
              ) : (
                <>For version control and hosting, I use <A href="https://github.com">GitHub</A>.</>
              )}
            </li>
            <li>
              {id ? (
                <>Untuk catatan dan manajemen pengetahuan, saya menggunakan <A href="https://obsidian.md">Obsidian</A>. Ini adalah editor Markdown lokal dengan tampilan grafik untuk menghubungkan ide — semua data tersimpan di disk dan disinkronkan dengan setup saya sendiri.</>
              ) : (
                <>For note-taking and knowledge management, I use <A href="https://obsidian.md">Obsidian</A>. It's a local-first Markdown editor with a graph view for linking ideas — all data stays on disk and syncs via my own setup.</>
              )}
            </li>
            <li>
              {id ? (
                <>Untuk manajemen file di terminal, saya menggunakan <A href="https://yazi-rs.github.io">Yazi</A> — file manager terminal cepat yang ditulis dengan Rust dengan dukungan preview gambar via Kitty image protocol.</>
              ) : (
                <>For file management in the terminal, I use <A href="https://yazi-rs.github.io">Yazi</A> — a fast terminal file manager written in Rust with image preview support via the Kitty image protocol.</>
              )}
            </li>
            <li>
              {id ? (
                <>Untuk musik, saya menggunakan <A href="https://spotify.com">Spotify</A> dengan <A href="https://spicetify.app">Spicetify</A> untuk memblokir iklan dan kustomisasi tampilan, serta <A href="https://music.apple.com">Apple Music</A> untuk audio lossless.</>
              ) : (
                <>For music, I use <A href="https://spotify.com">Spotify</A> with <A href="https://spicetify.app">Spicetify</A> for ad blocking and customization, and <A href="https://music.apple.com">Apple Music</A> for lossless audio.</>
              )}
            </li>
          </ul>

          {/* AI */}
          <h2>AI</h2>
          <ul>
            <li>
              {id ? (
                <><A href="https://claude.ai">Claude</A> dari Anthropic adalah asisten AI utama saya — saya menggunakannya untuk menulis, debugging, code review, dan pemecahan masalah umum. Model thinking sangat berguna untuk keputusan arsitektur yang kompleks.</>
              ) : (
                <><A href="https://claude.ai">Claude</A> by Anthropic is my primary AI assistant — I use it for writing, debugging, code review, and general problem-solving. The thinking models are particularly useful for complex architectural decisions.</>
              )}
            </li>
            <li>
              {id ? (
                <><A href="https://github.com/sst/opencode">OpenCode</A> adalah agen coding AI berbasis terminal saya. Ini terintegrasi langsung ke alur kerja terminal dan bekerja baik bersama Ghostty dan Zed.</>
              ) : (
                <><A href="https://github.com/sst/opencode">OpenCode</A> is my terminal-based AI coding agent. It integrates directly into the terminal workflow and works well alongside Ghostty and Zed.</>
              )}
            </li>
          </ul>

          {/* Theme */}
          <h2>{id ? "Tema" : "Theme"}</h2>
          <ul>
            <li>
              {id ? (
                <>Saya menggunakan skema warna <A href="https://catppuccin.com">Catppuccin</A> untuk hampir segalanya — terminal, editor, browser, dan website ini. Spesifiknya <strong>Catppuccin Mocha</strong> untuk dark mode dan <strong>Catppuccin Latte</strong> untuk light mode.</>
              ) : (
                <>I use the <A href="https://catppuccin.com">Catppuccin</A> color scheme for just about everything — terminal, editor, browser, and this website. Specifically <strong>Catppuccin Mocha</strong> for dark mode and <strong>Catppuccin Latte</strong> for light mode.</>
              )}
            </li>
            <li>
              {id ? (
                <>Untuk font terminal, saya menggunakan <A href="https://www.nerdfonts.com">Nerd Fonts</A> untuk dukungan ikon di terminal.</>
              ) : (
                <>For my terminal font, I use <A href="https://www.nerdfonts.com">Nerd Fonts</A> for icon support in the terminal.</>
              )}
            </li>
            <li>
              {id ? (
                <>Wallpaper saya adalah seni digital — sebuah adegan fantasi gelap dengan rusa roh bercahaya, sesuai dengan estetika Catppuccin Mocha.</>
              ) : (
                <>My wallpaper is custom digital art — a dark fantasy scene with glowing spirit deer, fitting the Catppuccin Mocha aesthetic.</>
              )}
            </li>
          </ul>

          {/* This site */}
          <h2>{id ? "Website Ini" : "This Site"}</h2>
          <ul>
            <li>
              {id ? (
                <>Website ini dibangun dengan <A href="https://nextjs.org">Next.js 16</A> menggunakan App Router, <A href="https://tailwindcss.com">Tailwind CSS v4</A>, dan TypeScript.</>
              ) : (
                <>This site is built with <A href="https://nextjs.org">Next.js 16</A> using the App Router, <A href="https://tailwindcss.com">Tailwind CSS v4</A>, and TypeScript.</>
              )}
            </li>
            <li>
              {id ? (
                <>Database didukung oleh <A href="https://supabase.com">Supabase</A> (PostgreSQL).</>
              ) : (
                <>The database is powered by <A href="https://supabase.com">Supabase</A> (PostgreSQL).</>
              )}
            </li>
            <li>
              {id ? (
                <>Di-host di <A href="https://vercel.com">Vercel</A>.</>
              ) : (
                <>Hosted on <A href="https://vercel.com">Vercel</A>.</>
              )}
            </li>
            <li>
              {id ? (
                <>Source code tersedia di <A href="https://github.com/NeiaKI/Portfolio-Web">GitHub</A>.</>
              ) : (
                <>Source code is available on <A href="https://github.com/NeiaKI/Portfolio-Web">GitHub</A>.</>
              )}
            </li>
          </ul>
        </article>
      </div>
    </MainLayout>
  );
}
