import { Brain, CheckCircle2, FileText, ListChecks, Upload } from "lucide-react";

const workflow = [
  { icon: Upload, title: "Upload PDF", detail: "Add notes, slides, or textbook material." },
  { icon: Brain, title: "Generate", detail: "Recall AI creates MCQs from the document." },
  { icon: ListChecks, title: "Answer", detail: "Move through questions at your own pace." },
  { icon: CheckCircle2, title: "Review", detail: "See your score and correct answers." },
];

export function ProductPreview() {
  return (
    <section className="bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-primary">Product Preview</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight md:text-5xl">From reading material to a recall session.</h2>
        </div>

        <div className="mt-12 rounded-xl border border-border bg-card p-4 shadow-sm md:p-6">
          <div className="grid gap-4 md:grid-cols-4">
            {workflow.map((item, index) => {
              const Icon = item.icon;

              return (
                <div key={item.title} className="relative rounded-lg border border-border bg-background p-5">
                  {index < workflow.length - 1 && <div className="absolute left-[calc(100%+1rem)] top-1/2 hidden h-px w-4 bg-border md:block" />}
                  <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="mt-5 font-extrabold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.detail}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-lg border border-border bg-background p-5">
              <div className="flex items-center gap-3">
                <FileText className="size-5 text-primary" />
                <p className="font-bold">Selected document</p>
              </div>
              <div className="mt-5 space-y-3">
                <div className="h-3 w-4/5 rounded-full bg-muted" />
                <div className="h-3 w-full rounded-full bg-muted" />
                <div className="h-3 w-2/3 rounded-full bg-muted" />
              </div>
            </div>
            <div className="rounded-lg border border-border bg-background p-5">
              <div className="flex items-center justify-between">
                <p className="font-bold">Quiz review</p>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">75% score</span>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {["Correct answers", "Needs review", "Next quiz"].map((label, index) => (
                  <div key={label} className="rounded-lg bg-muted p-4">
                    <p className="text-2xl font-black">{["9", "3", "12"][index]}</p>
                    <p className="mt-1 text-xs font-medium text-muted-foreground">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
