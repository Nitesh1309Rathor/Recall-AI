import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <>
      <header className="flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border bg-card text-sm font-bold shadow-sm">R</div>

          <div>
            <h1 className="text-base font-bold tracking-tight">Recall AI</h1>
            <p className="text-xs text-muted-foreground">Study smarter</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
        <Badge variant="secondary" className="rounded-full px-3 py-1">
          Level 1 · 80 XP
        </Badge>
          <ThemeToggle />
        </div>
      </header>

      <Separator />
    </>
  );
}
