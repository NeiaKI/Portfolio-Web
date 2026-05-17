import { MainLayout } from "@/components/layout/main-layout";
import { Monitor, Cpu, HardDrive, Keyboard, Mouse, Headphones, Code2, Terminal, Globe, Layers } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Uses",
  description: "Hardware and software I use daily.",
};

interface UseItem {
  name: string;
  desc: string;
  url?: string;
}

interface UseCategory {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  items: UseItem[];
}

const USES: UseCategory[] = [
  {
    icon: Monitor,
    label: "Workstation",
    items: [
      { name: "— coming soon —", desc: "Fill this in from your setup" },
    ],
  },
  {
    icon: Cpu,
    label: "Hardware",
    items: [
      { name: "— coming soon —", desc: "CPU, GPU, RAM, etc." },
    ],
  },
  {
    icon: Keyboard,
    label: "Peripherals",
    items: [
      { name: "— coming soon —", desc: "Keyboard, mouse, headphones, etc." },
    ],
  },
  {
    icon: Terminal,
    label: "Terminal & Shell",
    items: [
      { name: "— coming soon —", desc: "Shell, terminal emulator, etc." },
    ],
  },
  {
    icon: Code2,
    label: "Editor & IDE",
    items: [
      { name: "— coming soon —", desc: "Text editor, extensions, theme, etc." },
    ],
  },
  {
    icon: Globe,
    label: "Browser",
    items: [
      { name: "— coming soon —", desc: "Browser and extensions" },
    ],
  },
  {
    icon: Layers,
    label: "Apps & Tools",
    items: [
      { name: "— coming soon —", desc: "Day-to-day apps" },
    ],
  },
];

export default function UsesPage() {
  return (
    <MainLayout>
      <div className="flex flex-col gap-8 max-w-2xl">
        {/* Header */}
        <div className="flex flex-col gap-1.5">
          <h1 className="text-2xl font-bold text-foreground">Uses</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Hardware and software I use daily — inspired by{" "}
            <a href="https://uses.tech" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              uses.tech
            </a>
            .
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-col gap-8">
          {USES.map(({ icon: Icon, label, items }) => (
            <section key={label} className="flex flex-col gap-3">
              <div className="flex items-center gap-2 pb-1 border-b border-border">
                <Icon className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-semibold text-foreground">{label}</h2>
              </div>
              <div className="flex flex-col gap-2">
                {items.map((item) => (
                  <div key={item.name} className="flex flex-col gap-0.5 rounded-lg border border-border/40 bg-card px-4 py-3">
                    {item.url ? (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                      >
                        {item.name}
                      </a>
                    ) : (
                      <span className="text-sm font-medium text-foreground">{item.name}</span>
                    )}
                    <span className="text-xs text-muted-foreground">{item.desc}</span>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
