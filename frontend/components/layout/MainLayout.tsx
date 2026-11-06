"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, BookOpen, Home, ClipboardList, FileText, MessageSquareText, Layers3, FileQuestion, ClipboardCheck } from "lucide-react";
import { ProfileMenu } from "@/components/layout/ProfileMenu";
import { Sidebar } from "@/components/layout/Sidebar";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { api } from "@/lib/api";

type AuthUser = { id: string; email: string };
const mobileNav = [{ href: "/dashboard", label: "Dashboard", icon: Home }, { href: "/dashboard/documents", label: "Documents", icon: FileText }, { href: "/dashboard/chat", label: "Chat", icon: MessageSquareText }, { href: "/dashboard/summary", label: "Summary", icon: FileQuestion }, { href: "/dashboard/mcqs", label: "MCQs", icon: ClipboardList }, { href: "/dashboard/flashcards", label: "Flashcards", icon: Layers3 }, { href: "/dashboard/practice-test", label: "Practice Test", icon: ClipboardCheck }];

export function MainLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  useEffect(() => { api.me().then(({ user: nextUser }) => setUser(nextUser)).catch(() => setUser(null)); }, []);
  return <main className="h-dvh overflow-hidden bg-background text-foreground"><header className="sticky top-0 z-40 flex h-[86px] items-center justify-between border-b border-border bg-card px-6 sm:px-8 lg:px-12"><Link href="/home" className="flex items-center gap-3" aria-label="Recall AI home"><BookOpen className="size-10 text-primary" strokeWidth={2.1}/><span className="text-[28px] font-bold tracking-tight">Recall AI</span></Link><div className="flex items-center gap-5"><ThemeToggle/><button className="border-l border-border pl-5" aria-label="Notifications"><Bell className="size-6"/></button><ProfileMenu user={user}/></div></header><div className="flex h-[calc(100dvh-86px)]"><Sidebar/><div className="min-w-0 flex-1 overflow-y-auto"><nav className="flex gap-2 overflow-x-auto border-b border-border bg-card px-4 py-2 lg:hidden">{mobileNav.map(({ href, label, icon: Icon }) => <Link key={href} href={href} className="flex h-9 shrink-0 items-center gap-2 rounded-lg border border-border px-3 text-sm font-semibold"><Icon className="size-4"/>{label}</Link>)}</nav><div className="recall-page">{children}</div></div></div></main>;
}
