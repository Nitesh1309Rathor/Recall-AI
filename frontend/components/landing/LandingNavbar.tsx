import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";

import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#why-recall", label: "Why Recall" },
];

export function LandingNavbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/88 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="Recall AI home">
          <span className="flex size-10 items-center justify-center rounded-lg border border-primary/15 bg-card text-primary shadow-sm">
            <BookOpen className="size-5" strokeWidth={2.4} />
          </span>
          <span className="text-lg font-extrabold tracking-wide">
            RECALL <span className="text-primary">AI</span>
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
          <ThemeToggle />
          <Link href="/login" className={cn(buttonVariants({ variant: "ghost" }), "hidden sm:inline-flex")}>
            Login
          </Link>
          <Link href="/signup" className={cn(buttonVariants({ size: "lg" }), "h-10 px-4")}>
            Get Started
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
