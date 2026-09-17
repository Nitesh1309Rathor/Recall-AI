const steps = [
  { number: "01", title: "Upload", description: "Upload your PDF study material." },
  { number: "02", title: "Generate", description: "Recall AI creates questions from your document." },
  { number: "03", title: "Challenge", description: "Answer questions one at a time." },
  { number: "04", title: "Recall", description: "See your score and review what you missed." },
];

export function HowItWorks() {
  return (
    <section id="how-it-works">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div className="lg:sticky lg:top-24">
            <p className="text-sm font-bold uppercase tracking-widest text-primary">How it works</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight md:text-5xl">A simple loop for better recall.</h2>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">
              Add your material, generate a quiz, answer honestly, then use the review screen to decide what to revisit.
            </p>
          </div>

          <div className="space-y-4">
            {steps.map((step) => (
              <div key={step.number} className="grid gap-5 rounded-lg border border-border bg-card p-6 shadow-sm sm:grid-cols-[4rem_1fr]">
                <span className="text-2xl font-black text-primary">{step.number}</span>
                <div>
                  <h3 className="text-xl font-extrabold">{step.title}</h3>
                  <p className="mt-2 leading-7 text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
