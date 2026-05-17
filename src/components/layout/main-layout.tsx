import { NavSidebar } from "./nav-sidebar";
import { WidgetSidebar } from "./widget-sidebar";
import { MobileNav } from "./mobile-nav";
import { PageTransition } from "./page-transition";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { CommandPalette } from "@/components/ui/command-palette";

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen dot-bg">
      <CommandPalette />

      {/* Mobile top nav — shown below lg */}
      <MobileNav />

      <div className="mx-auto flex max-w-[1400px]">
        {/* Left sidebar — sticky, hidden on mobile */}
        <div className="hidden lg:flex lg:flex-col lg:w-52 lg:shrink-0 sticky top-0 h-screen overflow-y-auto scrollbar-hide border-r border-border/50">
          <NavSidebar />
        </div>

        {/* Main content */}
        <main className="flex-1 min-w-0 flex flex-col">
          <div className="flex-1 w-full px-4 py-6 sm:px-6 sm:py-8">
            <PageTransition>{children}</PageTransition>
          </div>
        </main>

        {/* Right widget sidebar — sticky, hidden below xl */}
        <div className="hidden xl:flex xl:flex-col xl:w-64 xl:shrink-0 sticky top-0 h-screen overflow-y-auto scrollbar-hide border-l border-border/50">
          <WidgetSidebar />
        </div>
      </div>

      <ScrollToTop />
    </div>
  );
}
