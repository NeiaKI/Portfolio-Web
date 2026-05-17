import Image from "next/image";
import { MainLayout } from "@/components/layout/main-layout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Uses",
  description: "Hardware and software I use daily — my full setup.",
};

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

export default function UsesPage() {
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
            Here's a full breakdown of the hardware and software I use daily.
            Inspired by <A href="https://uses.tech">uses.tech</A>.
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
              My desktop — Arch Linux + Hyprland + Waybar, with Catppuccin Mocha everywhere.
            </p>
          </div>

          <hr />

          {/* Hardware */}
          <h2>Hardware</h2>
          <ul>
            <li>
              My only machine is a{" "}
              <A href="https://www.lenovo.com/us/en/p/laptops/thinkpad/thinkpadT/ThinkPad-T480s/22TP2TT480S">
                Lenovo ThinkPad T480s
              </A>
              . It's a thin and light business laptop with a great keyboard,
              solid build quality, and good Linux compatibility out of the box.
              The T480s hits the sweet spot between portability and performance —
              lightweight enough to carry daily, yet powerful enough for
              development, 3D work, and running a full Wayland compositor.
            </li>
          </ul>

          {/* Software */}
          <h2>Software</h2>
          <ul>
            <li>
              For my operating system, I use{" "}
              <A href="https://archlinux.org">Arch Linux</A> (btw). It gets out
              of my way and lets me do my work. Very minimal and customizable.
            </li>
            <li>
              <A href="https://hyprland.org">Hyprland</A> is my window manager.
              It's a Wayland compositor with smooth animations and a tiling layout
              that keeps my workflow efficient.
            </li>
            <li>
              <A href="https://github.com/Alexays/Waybar">Waybar</A> is the
              status bar at the top — showing workspaces, time, weather, CPU, RAM,
              network, and battery.
            </li>
            <li>
              I use two terminal emulators —{" "}
              <A href="https://ghostty.org">Ghostty</A> as my daily driver for
              its speed and simplicity, and{" "}
              <A href="https://sw.kovidgoyal.net/kitty">Kitty</A> when I need
              image protocol support. For my shell, I use{" "}
              <A href="https://www.zsh.org">zsh</A> with plugins for syntax
              highlighting and auto-complete.
            </li>
            <li>
              For code editors, I rotate between three:{" "}
              <A href="https://code.visualstudio.com">VS Code</A> for general
              use,{" "}
              <A href="https://cursor.com">Cursor</A> when I want AI-assisted
              editing, and{" "}
              <A href="https://zed.dev">Zed</A> when I need raw speed — it's
              noticeably faster than the others for large files.
            </li>
            <li>
              For my browser, I primarily use{" "}
              <A href="https://zen-browser.app">Zen Browser</A> — a
              Firefox-based browser with a cleaner UI and better tab management.
              I also keep{" "}
              <A href="https://github.com/helium-browser/helium">Helium</A> around
              for lightweight browsing sessions.
            </li>
          </ul>

          {/* Applications */}
          <h2>Applications</h2>
          <ul>
            <li>
              For 3D modeling and rendering, I use{" "}
              <A href="https://www.blender.org">Blender</A>. It's the best free
              3D tool out there and the community is great.
            </li>
            <li>
              For version control and hosting, I use{" "}
              <A href="https://github.com">GitHub</A>.
            </li>
            <li>
              For note-taking, I use <strong>[Note App]</strong>.
            </li>
            <li>
              For file management, I use <strong>[File Manager]</strong>.
            </li>
          </ul>

          {/* AI */}
          <h2>AI</h2>
          <ul>
            <li>
              <A href="https://claude.ai">Claude</A> by Anthropic is my primary
              AI assistant — I use it for writing, debugging, code review, and
              general problem-solving. The thinking models are particularly useful
              for complex architectural decisions.
            </li>
            <li>
              <A href="https://github.com/sst/opencode">OpenCode</A> is my
              terminal-based AI coding agent. It integrates directly into the
              terminal workflow and works well alongside Ghostty and Zed.
            </li>
          </ul>

          {/* Theme */}
          <h2>Theme</h2>
          <ul>
            <li>
              I use the{" "}
              <A href="https://catppuccin.com">Catppuccin</A> color scheme for
              just about everything — terminal, editor, browser, and this website.
              Specifically <strong>Catppuccin Mocha</strong> for dark mode and{" "}
              <strong>Catppuccin Latte</strong> for light mode.
            </li>
            <li>
              For my terminal font, I use{" "}
              <A href="https://www.nerdfonts.com">Nerd Fonts</A> for icon support
              in the terminal.
            </li>
            <li>
              My wallpaper is custom digital art — a dark fantasy scene with
              glowing spirit deer, fitting the Catppuccin Mocha aesthetic.
            </li>
          </ul>

          {/* This site */}
          <h2>This Site</h2>
          <ul>
            <li>
              This site is built with{" "}
              <A href="https://nextjs.org">Next.js 16</A> using the App Router,{" "}
              <A href="https://tailwindcss.com">Tailwind CSS v4</A>, and TypeScript.
            </li>
            <li>
              The database is powered by{" "}
              <A href="https://supabase.com">Supabase</A> (PostgreSQL).
            </li>
            <li>
              Hosted on{" "}
              <A href="https://vercel.com">Vercel</A>.
            </li>
            <li>
              Source code is available on{" "}
              <A href="https://github.com/NeiaKI/Portfolio-Web">GitHub</A>.
            </li>
          </ul>
        </article>
      </div>
    </MainLayout>
  );
}
