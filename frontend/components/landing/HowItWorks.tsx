const steps = [
  { number: "01", title: "Upload", description: "Upload your PDF study material." },
  { number: "02", title: "Generate", description: "Recall AI creates questions from your document." },
  { number: "03", title: "Practice & Revise", description: "Use the generated material to learn and test your understanding." },
];

export function HowItWorks() {
  return (
    <section id="how-it-works"><div className="mx-5 rounded-2xl bg-[#f1f6ff] px-5 py-12 sm:mx-8 md:py-14 lg:mx-auto lg:max-w-[1200px] dark:bg-[#111b2d]">
        <div className="text-center"><h2 className="text-3xl font-bold tracking-tight md:text-[36px]">How It Works</h2><p className="mt-3 text-slate-600 dark:text-slate-300">Get from your notes to practice in just a few simple steps.</p></div>
          <div className="mt-10 grid gap-8 md:grid-cols-4">
            {steps.map((step) => (
              <div key={step.number} className="text-center">
                <span className="mx-auto flex size-10 items-center justify-center rounded-full bg-[#1769e8] text-lg font-bold text-white">{Number(step.number)}</span>
                <div><h3 className="mt-4 text-lg font-bold">{step.title}</h3><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
    </section>
  );
}
