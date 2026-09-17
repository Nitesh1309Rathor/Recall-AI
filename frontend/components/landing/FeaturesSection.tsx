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
    <section id="features" className="border-y border-border/60">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-widest text-primary">Features</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight md:text-5xl">Everything you need for a sharper quiz session.</h2>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">
            Recall AI focuses on the workflow that is working today: upload a PDF, generate MCQs, take the quiz, and review your results.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {currentFeatures.map((feature) => {
            const Icon = feature.icon;

            return (
              <div key={feature.title} className="rounded-lg border border-border bg-card p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </div>
                <h3 className="mt-5 font-extrabold">{feature.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{feature.description}</p>
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
