import Link from "next/link";
import { MainLayout } from "@/components/layout/main-layout";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <MainLayout>
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
        {/* Big 404 */}
        <div className="select-none">
          <p className="text-[8rem] font-black leading-none text-foreground/10 sm:text-[12rem]">
            404
          </p>
        </div>

        <div className="-mt-8 flex flex-col items-center gap-2">
          <h1 className="text-2xl font-bold text-foreground">Page not found</h1>
          <p className="max-w-sm text-sm text-muted-foreground">
            Halaman yang kamu cari tidak ada atau sudah dipindahkan.
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          <Home className="h-4 w-4" />
          Back to Home
        </Link>
      </div>
    </MainLayout>
  );
}
