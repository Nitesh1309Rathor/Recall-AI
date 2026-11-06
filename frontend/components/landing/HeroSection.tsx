import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle2, FileText, Layers3, ListChecks, Sparkles } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function HeroSection() {
  return (
    <section className="relative">
      <div className="mx-auto grid max-w-[1280px] gap-12 px-5 py-14 sm:px-8 md:py-20 lg:grid-cols-[.95fr_1.05fr] lg:items-center lg:px-10">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-[#e8f2ff] px-4 py-2 text-sm font-semibold text-primary dark:bg-primary/15">
            AI Study Assistant
          </div>

          <h1 className="mt-5 max-w-xl text-[40px] font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-[48px]">
            Turn your study material into practice and revision tools with AI.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            Upload your notes or paste a web link to generate summaries, MCQs and flashcards in seconds.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/dashboard" className={cn(buttonVariants({ size: "lg" }), "h-12 rounded-lg bg-[#1769e8] px-7 text-base")}>
              Get Started
              <ArrowRight className="size-4" />
            </Link>
            <Link href="#features" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-12 rounded-lg border-[#c7d5ea] px-7 text-base")}>
              See Features
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
          <div className="overflow-hidden rounded-2xl border border-[#cbd9ec] bg-white shadow-[0_18px_45px_rgba(37,77,140,0.12)] dark:bg-[#111b2d]">
            <div className="flex items-center gap-3 border-b border-border px-5 py-4"><BookOpen className="size-6 text-primary"/><span className="font-bold">Recall AI</span></div>
            <div className="grid grid-cols-[140px_1fr]"><div className="border-r border-border p-3 text-xs font-semibold"><div className="rounded-lg bg-[#e8f2ff] px-3 py-3 text-primary dark:bg-primary/15">⌂ &nbsp; Home</div>{[[FileText,"Documents"],[Sparkles,"MCQs"],[Layers3,"Flashcards"],[ListChecks,"Summary"]].map(([Icon,label])=><div key={String(label)} className="flex items-center gap-2 px-3 py-3"><Icon className="size-4"/>{String(label)}</div>)}</div><div className="p-5"><p className="text-lg font-bold">Welcome back, Nitesh 👋</p><p className="text-xs text-slate-500">Continue your learning</p><div className="mt-4 grid grid-cols-3 gap-3">{[[Sparkles,"Generate MCQs","#e8f4ff"],[FileText,"Summarize","#f0edff"],[Layers3,"Flashcards","#e8fae9"]].map(([Icon,label,color])=><div key={String(label)} style={{backgroundColor:String(color)}} className="flex h-16 flex-col items-center justify-center gap-1 rounded-lg text-[10px] font-semibold"><Icon className="size-5 text-primary"/>{String(label)}</div>)}</div><p className="mt-5 text-sm font-bold">Recent Documents</p>{["Operating System Notes.pdf","https://react.dev/learn"].map((item,i)=><div key={item} className="mt-2 flex items-center justify-between rounded-lg border border-border px-3 py-2 text-[10px]"><span className="flex items-center gap-2"><FileText className="size-4 text-primary"/>{item}</span><span className="text-slate-500">{i?"5 days ago":"2 days ago"}</span></div>)}</div></div>
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
