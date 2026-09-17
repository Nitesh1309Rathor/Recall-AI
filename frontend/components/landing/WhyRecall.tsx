import { Brain, Repeat2 } from "lucide-react";

export function WhyRecall() {
  return (
    <section id="why-recall" className="bg-muted/30">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-2 lg:items-center lg:px-8">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-primary">Why Recall AI</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight md:text-5xl">Do not just reread. Recall.</h2>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">
            Rereading can feel productive even when the information is not sticking. Recall AI nudges you into active recall by turning your own study material into questions you have to answer.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-border bg-card p-6">
            <Repeat2 className="size-7 text-muted-foreground" />
            <h3 className="mt-6 font-extrabold">Passive review</h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">Reading the same page again can hide weak spots until exam day.</p>
          </div>
          <div className="rounded-lg border border-primary/20 bg-card p-6 shadow-sm">
            <Brain className="size-7 text-primary" />
            <h3 className="mt-6 font-extrabold">Active recall</h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">Answering questions reveals what you know and what needs another pass.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
