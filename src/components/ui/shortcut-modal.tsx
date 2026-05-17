"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

const SHORTCUTS = [
  { group: "Navigation",
    items: [
      { keys: ["⌘", "1"], desc: "Home" },
      { keys: ["⌘", "2"], desc: "Projects" },
      { keys: ["⌘", "3"], desc: "Blog" },
      { keys: ["⌘", "4"], desc: "Certificates" },
      { keys: ["⌘", "5"], desc: "Donate" },
    ],
  },
  { group: "Global",
    items: [
      { keys: ["⌘", "K"], desc: "Command Palette" },
      { keys: ["⌘", "⇧", "L"], desc: "Toggle Dark / Light mode" },
      { keys: ["?"], desc: "Show keyboard shortcuts" },
      { keys: ["Esc"], desc: "Close modal / palette" },
    ],
  },
  { group: "Scrolling",
    items: [
      { keys: ["j"], desc: "Scroll down" },
      { keys: ["k"], desc: "Scroll up" },
    ],
  },
  { group: "Blog",
    items: [
      { keys: ["F"], desc: "Posts tab" },
      { keys: ["G"], desc: "Dev.to tab" },
      { keys: ["H"], desc: "Medium tab" },
      { keys: ["←", "→"], desc: "Previous / Next screenshot" },
    ],
  },
];

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex items-center justify-center rounded border border-border bg-muted px-1.5 py-0.5 text-[11px] font-semibold text-foreground min-w-[20px]">
      {children}
    </kbd>
  );
}

export function ShortcutModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      const editable = (e.target as HTMLElement)?.isContentEditable;
      if (tag === "input" || tag === "textarea" || tag === "select" || editable) return;

      if (e.key === "?") setOpen((o) => !o);
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9998] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
      onClick={() => setOpen(false)}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Keyboard shortcuts"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2 className="font-semibold text-foreground text-sm">Keyboard Shortcuts</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Press <Kbd>?</Kbd> anytime to toggle</p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Shortcut groups */}
        <div className="grid grid-cols-2 gap-0 divide-x divide-border max-h-[60vh] overflow-y-auto">
          {SHORTCUTS.map((group) => (
            <div key={group.group} className="flex flex-col gap-1 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-2">
                {group.group}
              </p>
              {group.items.map((item) => (
                <div key={item.desc} className="flex items-center justify-between gap-3 py-0.5">
                  <span className="text-xs text-muted-foreground">{item.desc}</span>
                  <div className="flex items-center gap-0.5 shrink-0">
                    {item.keys.map((k, i) => <Kbd key={i}>{k}</Kbd>)}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
