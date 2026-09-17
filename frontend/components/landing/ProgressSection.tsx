import { Flame, Trophy, Zap } from "lucide-react";

export function ProgressSection() {
  return (
    <section>
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm md:p-10">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-primary">Progress</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight md:text-5xl">Learn. Recall. Level up.</h2>
              <p className="mt-5 text-lg leading-8 text-muted-foreground">
                A little progress signal makes practice feel visible without turning studying into noise.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { icon: Zap, value: "320", label: "Study XP" },
                { icon: Trophy, value: "Level 4", label: "Recall rank" },
                { icon: Flame, value: "5 days", label: "Learning streak" },
              ].map((stat) => {
                const Icon = stat.icon;

                return (
                  <div key={stat.label} className="rounded-lg border border-border bg-background p-5">
                    <Icon className="size-5 text-primary" />
                    <p className="mt-5 text-2xl font-black">{stat.value}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
