import { Clock3 } from "lucide-react";

export default function HistoryPage() {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">History</h1>
        <p className="mt-3 text-base text-muted-foreground">Quiz history will live here as Recall AI starts saving completed practice sessions.</p>
      </div>

      <section className="rounded-lg border border-dashed border-border bg-card p-8 text-center shadow-sm">
        <div className="mx-auto flex size-12 items-center justify-center rounded-lg bg-muted text-primary">
          <Clock3 className="size-6" />
        </div>
        <h2 className="mt-5 text-xl font-extrabold">Practice history is coming soon</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
          Your current quiz flow still works as before. This page is reserved for saved scores, attempts, and review history once that feature is implemented.
        </p>
      </section>
    </>
  );
}
