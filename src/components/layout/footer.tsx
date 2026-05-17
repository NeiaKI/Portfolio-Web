import Link from "next/link";

const LINKS = [
  { label: "Home",         href: "/en" },
  { label: "Projects",     href: "/en/project" },
  { label: "Blog",         href: "/en/blog" },
  { label: "Certificates", href: "/en/certificates" },
  { label: "Changelog",    href: "/en/changelog" },
  { label: "Contact",      href: "/en/contact" },
];

const SOCIALS = [
  { label: "GitHub",    href: "https://github.com/NeiaKI" },
  { label: "LinkedIn",  href: "https://linkedin.com/in/febiyanto-rizki" },
  { label: "Instagram", href: "https://instagram.com/nateeki" },
  { label: "X / Twitter", href: "https://x.com/nateeki" },
];

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border/50 px-6 py-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        {/* Brand */}
        <div className="flex flex-col gap-1">
          <span className="font-bold text-foreground text-sm">nateeki</span>
          <span className="text-xs text-muted-foreground">Software Engineer & 3D Artist</span>
          <span className="text-xs text-muted-foreground">Tangerang Selatan, Indonesia</span>
        </div>

        {/* Nav links */}
        <div className="flex flex-col gap-1.5">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-1">Pages</p>
          {LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors w-fit"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Social links */}
        <div className="flex flex-col gap-1.5">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-1">Connect</p>
          {SOCIALS.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors w-fit"
            >
              {label}
            </a>
          ))}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between text-[11px] text-muted-foreground/50">
        <span>© {new Date().getFullYear()} Febiyanto Rizki Qurbandi</span>
        <span>Built with Next.js & Catppuccin</span>
      </div>
    </footer>
  );
}
