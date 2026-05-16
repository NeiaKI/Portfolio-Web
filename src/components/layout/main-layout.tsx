import { NavSidebar } from "./nav-sidebar";
import { WidgetSidebar } from "./widget-sidebar";
import { MobileNav } from "./mobile-nav";
import { ScrollToTop } from "@/components/ui/scroll-to-top";

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen dot-bg">
      {/* Mobile top nav */}
      <MobileNav />

      <div className="mx-auto flex max-w-[1400px]">
        {/* Left sidebar — sticky, hidden on mobile */}
        <div className="hidden lg:flex lg:flex-col lg:w-52 lg:shrink-0 sticky top-0 h-screen overflow-y-auto scrollbar-hide border-r border-border/50">
          <NavSidebar />
        </div>

        {/* Main content */}
        <main className="flex-1 min-w-0 overflow-y-auto">
          <div className="w-full px-6 py-8">
            {children}
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
