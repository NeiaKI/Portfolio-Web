"use client";

import { useEffect } from "react";
import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { BackToTop } from "@/components/ui/back-to-top";
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
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange={false}
      scriptProps={{ suppressHydrationWarning: true }}
    >
      <TooltipProvider delay={500}>
        <VimKeys />
        <ScrollProgress />
        <BackToTop />
        <ShortcutModal />
        {children}
      </TooltipProvider>
    </ThemeProvider>
  );
}
