"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { ClipboardCheck, ClipboardList, FileQuestion, FileText, Layers3, LogOut, MessageSquareText, Home, PanelLeftClose, PanelLeftOpen } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

const mainNav = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/dashboard/documents", label: "Documents", icon: FileText },
  { href: "/dashboard/chat", label: "Chat", icon: MessageSquareText },
  { href: "/dashboard/summary", label: "Summary", icon: FileQuestion },
  { href: "/dashboard/mcqs", label: "MCQs", icon: ClipboardList },
  { href: "/dashboard/flashcards", label: "Flashcards", icon: Layers3 },
  { href: "/dashboard/practice-test", label: "Practice Test", icon: ClipboardCheck },
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
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(() => typeof window !== "undefined" && window.localStorage.getItem("recall-sidebar-collapsed") === "true");
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);

  function toggleSidebar() {
    setCollapsed((current) => {
      const next = !current;
      window.localStorage.setItem("recall-sidebar-collapsed", String(next));
      return next;
    });
  }

  async function handleLogout() {
    if (!window.confirm("Are you sure you want to log out?")) return;
    try {
      setLogoutError(null);
      setLoggingOut(true);
      await api.logout();
      router.replace("/");
      router.refresh();
    } catch (error) {
      setLogoutError(error instanceof Error ? error.message : "Unable to log out.");
      setLoggingOut(false);
    }
  }

  return (
    <aside className={cn("hidden h-[calc(100dvh-86px)] shrink-0 border-r border-sidebar-border bg-sidebar py-6 transition-[width,padding] duration-200 lg:flex lg:flex-col", collapsed ? "w-[84px] px-3" : "w-[278px] px-5")}>
      <div className={cn("mb-5 flex items-center", collapsed ? "justify-center" : "justify-end")}>
        <button type="button" onClick={toggleSidebar} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"} title={collapsed ? "Expand sidebar" : "Collapse sidebar"} className="flex size-9 items-center justify-center rounded-lg border border-sidebar-border text-sidebar-foreground transition hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
          {collapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
        </button>
      </div>

      <nav className="space-y-8">
        <div>
          {!collapsed && <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Workspace</p>}
          <div className="mt-3 space-y-1.5">
            {mainNav.map((item) => {
              const Icon = item.icon;
              const active = isActive(pathname, item.href);
              return <Link key={item.href} href={item.href} title={collapsed ? item.label : undefined} aria-label={collapsed ? item.label : undefined} className={cn("flex h-12 items-center rounded-lg text-[16px] font-semibold transition", collapsed ? "justify-center px-0" : "gap-3 px-4", active ? "bg-sidebar-accent text-sidebar-primary" : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground")}><Icon className="size-5 shrink-0" />{!collapsed && item.label}</Link>;
            })}
          </div>
        </div>

        <div>
          {!collapsed && <p className="px-2 text-xs font-black uppercase tracking-widest text-muted-foreground">Study Tools</p>}
          <div className="mt-3 space-y-1.5">
            {studyTools.map((item) => { const Icon = item.icon; return <button key={item.label} type="button" disabled title={collapsed ? `${item.label} (Coming soon)` : "Coming soon"} aria-label={collapsed ? `${item.label} (Coming soon)` : undefined} className={cn("flex h-11 w-full items-center rounded-lg text-left text-sm font-bold text-muted-foreground/70", collapsed ? "justify-center px-0" : "justify-between px-4")}><span className={cn("flex items-center", !collapsed && "gap-3")}><Icon className="size-5 shrink-0" />{!collapsed && item.label}</span>{!collapsed && <Badge variant="outline" className="h-5 rounded-full px-2 text-[10px]">Soon</Badge>}</button>; })}
          </div>
        </div>
      </nav>

      <div className="mt-auto border-t border-sidebar-border pt-4">
        {logoutError && !collapsed && <p className="mb-2 px-2 text-xs text-destructive" role="alert">{logoutError}</p>}
        <button type="button" onClick={handleLogout} disabled={loggingOut} title={loggingOut ? "Logging out..." : "Log out"} aria-label={loggingOut ? "Logging out" : "Log out"} className={cn("flex h-11 w-full items-center rounded-lg text-sm font-semibold text-sidebar-foreground transition hover:bg-sidebar-accent hover:text-sidebar-accent-foreground disabled:opacity-60", collapsed ? "justify-center px-0" : "gap-3 px-3")}><LogOut className="size-5 shrink-0" />{!collapsed && (loggingOut ? "Logging out..." : "Log out")}</button>
      </div>
    </aside>
  );
}
