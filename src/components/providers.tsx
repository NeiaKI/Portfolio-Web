"use client";

import { useEffect } from "react";
import { ThemeProvider } from "@/lib/theme";
import { MotionProvider } from "@/components/motion-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { ShortcutModal } from "@/components/ui/shortcut-modal";

const SCROLL_STEP = 96;

function VimKeys() {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      const editable = (e.target as HTMLElement)?.isContentEditable;
      if (tag === "input" || tag === "textarea" || tag === "select" || editable) return;

      if (e.key === "j") {
        e.preventDefault();
        window.scrollBy({ top: SCROLL_STEP, behavior: "smooth" });
      } else if (e.key === "k") {
        e.preventDefault();
        window.scrollBy({ top: -SCROLL_STEP, behavior: "smooth" });
      } else if (e.key === "/") {
        // Buka command palette langsung di mode pemilih tema.
        e.preventDefault();
        window.dispatchEvent(new Event("open-theme-picker"));
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <MotionProvider>
        <TooltipProvider delay={500}>
          <VimKeys />
          <ScrollProgress />
          <ShortcutModal />
          {children}
        </TooltipProvider>
      </MotionProvider>
    </ThemeProvider>
  );
}
