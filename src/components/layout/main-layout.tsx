import { NavSidebar } from "./nav-sidebar";
import { WidgetSidebar } from "./widget-sidebar";
import { MobileNav } from "./mobile-nav";

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Mobile top nav */}
      <MobileNav />

      <div className="flex flex-1">
        {/* Left nav sidebar — hidden on mobile */}
        <div className="hidden lg:flex lg:flex-col lg:border-r lg:border-border lg:w-64 lg:shrink-0 sticky top-0 h-screen overflow-y-auto">
          <NavSidebar />
        </div>

        {/* Main content */}
        <main className="flex-1 min-w-0 overflow-y-auto">
          <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>

        {/* Right widget sidebar — hidden on mobile and tablet */}
        <div className="hidden xl:flex xl:flex-col xl:border-l xl:border-border xl:w-64 xl:shrink-0 sticky top-0 h-screen overflow-y-auto">
          <WidgetSidebar />
        </div>
      </div>
    </div>
  );
}
