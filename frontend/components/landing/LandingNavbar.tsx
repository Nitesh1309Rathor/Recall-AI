import Link from "next/link";
import { BookOpen } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ProfileMenu } from "@/components/layout/ProfileMenu";

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#why-recall", label: "Why Recall" },
];

export function LandingNavbar({ authenticated = false, user }: { authenticated?: boolean; user?: { id: string; email: string } | null }) {
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/88 backdrop-blur-xl">
      <div className="mx-auto flex h-[74px] max-w-[1280px] items-center justify-between px-5 sm:px-8 lg:px-10">
        <Link href={authenticated ? "/home" : "/"} className="flex items-center gap-3" aria-label="Recall AI home">
          <span className="flex size-10 items-center justify-center text-primary">
            <BookOpen className="size-8" strokeWidth={2.1} />
          </span>
          <span className="text-[21px] font-bold tracking-tight">
            Recall AI
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium text-muted-foreground md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {authenticated ? <><Link href="/dashboard" className={cn(buttonVariants({ size: "lg" }), "h-10 rounded-lg bg-[#1769e8] px-5")}>Dashboard</Link><ProfileMenu user={user} /></> : <><Link href="/login" className={cn(buttonVariants({ variant: "outline" }), "hidden h-10 rounded-lg border-[#c7d5ea] bg-white px-5 sm:inline-flex dark:bg-[#111b2d]")}>Log in</Link><Link href="/signup" className={cn(buttonVariants({ size: "lg" }), "h-10 rounded-lg bg-[#1769e8] px-5")}>Sign up</Link></>}
        </div>
      </div>
    </header>
  );
}
