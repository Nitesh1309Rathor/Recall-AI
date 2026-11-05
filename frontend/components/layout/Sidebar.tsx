"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, ClipboardList, Clock3, FileQuestion, FileText, Layers3, MessageSquareText } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const mainNav = [
  { href: "/dashboard", label: "Generate MCQs", icon: ClipboardList },
  { href: "/dashboard/documents", label: "Documents", icon: FileText },
  { href: "/dashboard/history", label: "History", icon: Clock3 },
];

const studyTools = [
  { label: "Summaries", icon: FileQuestion },
  { label: "Flashcards", icon: Layers3 },
  { label: "Q&A", icon: MessageSquareText },
];

function isActive(pathname: string, href: string) {
  return pathname === href || (href !== "/dashboard" && pathname.startsWith(`${href}/`));
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden h-dvh w-[296px] shrink-0 border-r border-border bg-card px-5 py-6 shadow-[18px_0_45px_rgba(30,41,59,0.06)] lg:flex lg:flex-col">
      <Link href="/" className="flex items-center gap-4 rounded-lg px-2 py-2 transition hover:bg-muted" aria-label="Go to Recall AI landing page">
        <span className="flex size-11 items-center justify-center rounded-md border border-primary/20 bg-card text-primary shadow-sm">
          <BookOpen className="size-7" strokeWidth={2.3} />
        </span>
        <span>
          <span className="block text-2xl font-extrabold leading-none tracking-wide">
            RECALL <span className="text-primary">AI</span>
          </span>
          <span className="mt-2 block text-sm text-muted-foreground">Level up your learning.</span>
        </span>
      </Link>

      <nav className="mt-10 space-y-8">
        <div>
          <p className="px-2 text-xs font-black uppercase tracking-widest text-muted-foreground">Main</p>
          <div className="mt-3 space-y-1.5">
            {mainNav.map((item) => {
              const Icon = item.icon;
              const active = isActive(pathname, item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex h-11 items-center gap-3 rounded-lg px-4 text-sm font-bold transition",
                    active ? "border border-primary/20 bg-primary/10 text-primary shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <Icon className="size-5" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>

        <div>
          <p className="px-2 text-xs font-black uppercase tracking-widest text-muted-foreground">Study Tools</p>
          <div className="mt-3 space-y-1.5">
            {studyTools.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.label}
                  type="button"
                  disabled
                  className="flex h-11 w-full items-center justify-between rounded-lg px-4 text-left text-sm font-bold text-muted-foreground/70"
                  title="Coming soon"
                >
                  <span className="flex items-center gap-3">
                    <Icon className="size-5" />
                    {item.label}
                  </span>
                  <Badge variant="outline" className="h-5 rounded-full px-2 text-[10px]">
                    Soon
                  </Badge>
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </aside>
  );
}
