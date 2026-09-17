import Link from "next/link";
import { BookOpen } from "lucide-react";

export function LandingFooter() {
  return (
    <footer>
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 text-sm text-muted-foreground sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-lg border border-border bg-card text-primary">
            <BookOpen className="size-4" />
          </span>
          <div>
            <p className="font-extrabold tracking-wide text-foreground">RECALL AI</p>
            <p>Turn what you read into what you remember.</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-5">
          <Link href="#features" className="transition hover:text-foreground">
            Features
          </Link>
          <Link href="#how-it-works" className="transition hover:text-foreground">
            How it works
          </Link>
          <Link href="#why-recall" className="transition hover:text-foreground">
            Why Recall
          </Link>
          <span>2026 Recall AI</span>
        </div>
      </div>
    </footer>
  );
}
