import { BadgeCheck, FileText, ListChecks, SearchCheck, Sparkles } from "lucide-react";

const currentFeatures = [
  { icon: Sparkles, title: "AI-generated MCQs", description: "Create practice questions from your uploaded PDF study material." },
  { icon: FileText, title: "Study from your documents", description: "Use notes, textbooks, handouts, or lecture PDFs already in your workflow." },
  { icon: ListChecks, title: "Interactive quiz mode", description: "Answer one question at a time and navigate through the quiz clearly." },
  { icon: SearchCheck, title: "Instant answer review", description: "Submit, check your score, and revisit the answers you missed." },
];

const comingSoon = ["Document Q&A", "Summaries", "Flashcards"];

export function FeaturesSection() {
  return (
    <section id="features">
      <div className="mx-auto max-w-[1280px] px-5 py-16 sm:px-8 md:py-24 lg:px-10">
        <div className="text-center"><h2 className="text-3xl font-bold tracking-tight md:text-[38px]">Features</h2><p className="mt-3 text-base text-slate-600 dark:text-slate-300">Everything you need to study, revise and practice effectively.</p></div>

        <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {currentFeatures.map((feature) => {
            const Icon = feature.icon;

            return (
              <div key={feature.title} className="rounded-xl border border-[#dbe5f2] bg-white p-6 transition hover:border-primary/40 dark:border-slate-700 dark:bg-[#111b2d]">
                <div className="flex size-12 items-center justify-center rounded-xl bg-[#e8f2ff] text-primary dark:bg-primary/15">
                  <Icon className="size-5" />
                </div>
                <h3 className="mt-5 text-lg font-bold">{feature.title.replace("AI-generated ", "")}</h3>
                <p className="mt-2 text-[15px] leading-6 text-slate-600 dark:text-slate-300">{feature.description}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3 rounded-lg border border-dashed border-border bg-muted/40 p-4">
          <span className="flex items-center gap-2 text-sm font-bold">
            <BadgeCheck className="size-4 text-primary" />
            Coming soon
          </span>
          {comingSoon.map((item) => (
            <span key={item} className="rounded-full border border-border bg-background px-3 py-1 text-sm text-muted-foreground">
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
