import Link from "next/link";
import { ArrowRight, CheckCircle2, FileText, Sparkles } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function HeroSection() {
  return (
    <section className="relative border-b border-border/60">
      <div className="absolute inset-x-0 top-0 -z-10 h-80 bg-[radial-gradient(circle_at_top,color-mix(in_oklch,var(--primary),transparent_88%),transparent_62%)]" />
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-[1fr_0.92fr] lg:items-center lg:px-8">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium text-muted-foreground shadow-sm">
            <Sparkles className="size-4 text-primary" />
            AI-powered active recall for your PDFs
          </div>

          <h1 className="mt-7 max-w-4xl text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl">
            Study less passively. Remember more actively.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            Upload your study material, generate AI-powered MCQs, and test what you know with a focused quiz and instant review.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/dashboard" className={cn(buttonVariants({ size: "lg" }), "h-12 px-6 text-base")}>
              Start Studying
              <ArrowRight className="size-4" />
            </Link>
            <Link href="#how-it-works" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-12 px-6 text-base")}>
              See How It Works
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground">
            {["PDF upload", "AI-generated MCQs", "Score and review"].map((item) => (
              <span key={item} className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-primary" />
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="rounded-xl border border-border bg-card p-4 shadow-[0_24px_70px_rgba(15,23,42,0.14)] dark:shadow-[0_24px_70px_rgba(0,0,0,0.35)]">
            <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-lg bg-muted text-primary">
                  <FileText className="size-5" />
                </span>
                <div>
                  <p className="font-bold">Biology_notes.pdf</p>
                  <p className="text-sm text-muted-foreground">12 MCQs generated</p>
                </div>
              </div>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">Quiz live</span>
            </div>

            <div className="pt-5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-bold">Question 4 of 12</span>
                <span className="text-muted-foreground">42 XP</span>
              </div>
              <div className="mt-3 h-2 rounded-full bg-muted">
                <div className="h-full w-1/3 rounded-full bg-primary" />
              </div>

              <div className="mt-6 rounded-lg border border-border bg-background p-5">
                <p className="text-sm font-semibold text-muted-foreground">Active recall prompt</p>
                <h2 className="mt-2 text-xl font-extrabold leading-snug">Which process converts light energy into chemical energy?</h2>
                <div className="mt-5 space-y-3">
                  {["Cellular respiration", "Photosynthesis", "Diffusion", "Osmosis"].map((option, index) => (
                    <div
                      key={option}
                      className={cn(
                        "flex items-center justify-between rounded-lg border px-4 py-3 text-sm font-medium",
                        index === 1 ? "border-primary bg-primary/10 text-foreground" : "border-border bg-card text-muted-foreground",
                      )}
                    >
                      {option}
                      {index === 1 && <CheckCircle2 className="size-4 text-primary" />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-5 -left-4 hidden rounded-lg border border-border bg-background p-4 shadow-xl sm:block">
            <p className="text-xs font-semibold text-muted-foreground">Review score</p>
            <p className="mt-1 text-2xl font-black">9/12</p>
          </div>
        </div>
      </div>
    </section>
  );
}
