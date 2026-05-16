import { Construction } from "lucide-react";
import { MainLayout } from "@/components/layout/main-layout";

interface ComingSoonProps {
  title: string;
}

export function ComingSoon({ title }: ComingSoonProps) {
  return (
    <MainLayout>
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
          <Construction className="h-8 w-8 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        <p className="text-sm text-muted-foreground max-w-sm">
          This page is under construction and will be available in a future phase.
        </p>
      </div>
    </MainLayout>
  );
}
