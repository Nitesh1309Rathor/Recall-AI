"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, BookOpen, ClipboardList, Clock3, FileQuestion, FileText, Layers3, MessageSquareText } from "lucide-react";

import { ProfileMenu } from "@/components/layout/ProfileMenu";
import { Sidebar } from "@/components/layout/Sidebar";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

type AuthUser = {
  id: string;
  email: string;
};

type MainLayoutProps = {
  children: React.ReactNode;
};

const mobileNav = [
  { href: "/dashboard", label: "MCQs", icon: ClipboardList },
  { href: "/dashboard/documents", label: "Docs", icon: FileText },
  { href: "/dashboard/history", label: "History", icon: Clock3 },
];

const mobileComingSoon = [
  { label: "Summaries", icon: FileQuestion },
  { label: "Flashcards", icon: Layers3 },
  { label: "Q&A", icon: MessageSquareText },
];

export function MainLayout({ children }: MainLayoutProps) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    api
      .me()
      .then(({ user }) => setUser(user))
      .catch(() => setUser(null));
  }, []);

  return (
    <main className="h-dvh overflow-hidden bg-background text-foreground">
      <div className="flex h-full">
        <Sidebar />

        <div className="min-w-0 flex-1 overflow-y-auto">
          <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
            <div className="flex min-h-16 items-center justify-between gap-4 px-4 py-2 sm:px-6 lg:px-8">
              <Link href="/" className="flex items-center gap-3 lg:hidden" aria-label="Go to Recall AI landing page">
                <span className="flex size-10 items-center justify-center rounded-md border border-primary/20 bg-card text-primary">
                  <BookOpen className="size-6" />
                </span>
                <span className="font-extrabold tracking-wide">
                  RECALL <span className="text-primary">AI</span>
                </span>
              </Link>

              <div className="hidden text-xl text-muted-foreground lg:block">Focused study workspace</div>

              <div className="ml-auto flex items-center gap-3">
                <ThemeToggle />
                <button
                  className="flex size-11 items-center justify-center rounded-lg border border-border bg-card shadow-sm transition hover:bg-muted"
                  aria-label="Notifications"
                >
                  <Bell className="size-5" />
                </button>
                <ProfileMenu user={user} />
              </div>
            </div>

            <nav className="flex gap-2 overflow-x-auto border-t border-border px-4 py-2 lg:hidden">
              {mobileNav.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex h-9 shrink-0 items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm font-bold"
                  >
                    <Icon className="size-4" />
                    {item.label}
                  </Link>
                );
              })}
              {mobileComingSoon.map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.label}
                    type="button"
                    disabled
                    className={cn(
                      "flex h-9 shrink-0 items-center gap-2 rounded-lg border border-border bg-muted px-3 text-sm font-bold text-muted-foreground/70",
                    )}
                    title="Coming soon"
                  >
                    <Icon className="size-4" />
                    {item.label}
                    <Badge variant="outline" className="h-5 rounded-full px-2 text-[10px]">
                      Soon
                    </Badge>
                  </button>
                );
              })}
            </nav>
          </header>

          <div className="mx-auto w-full max-w-[1180px] px-4 py-6 sm:px-6 lg:px-8">{children}</div>
        </div>
      </div>
    </main>
  );
}
