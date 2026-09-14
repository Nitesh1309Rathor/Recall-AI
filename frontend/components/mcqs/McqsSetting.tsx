"use client";

import { Lightbulb, Minus, Plus, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

interface McqSettingsProps {
  count: number;
  onCountChange: (count: number) => void;
  onGenerate: () => void;
  disabled?: boolean;
  generating?: boolean;
}

export function McqSettings({ count, onCountChange, onGenerate, disabled, generating }: McqSettingsProps) {
  function decrease() {
    onCountChange(Math.max(1, count - 1));
  }

  function increase() {
    onCountChange(Math.min(50, count + 1));
  }

  return (
    <section className="rounded-lg border border-border bg-card p-7 shadow-[0_18px_35px_rgba(30,41,59,0.08)]">
      <h2 className="text-xl font-extrabold">MCQ Settings</h2>

      <div className="mt-7">
        <p className="mb-4 text-sm font-semibold">Number of MCQs</p>

        <div className="grid h-[58px] grid-cols-[62px_1fr_62px] overflow-hidden rounded-lg border border-border bg-background">
          <Button variant="ghost" className="h-full rounded-none border-r border-border text-muted-foreground" onClick={decrease} disabled={generating || count <= 1}>
            <Minus className="h-5 w-5" />
          </Button>

          <div className="flex items-center justify-center text-xl font-extrabold">{count}</div>

          <Button variant="ghost" className="h-full rounded-none border-l border-border" onClick={increase} disabled={generating || count >= 50}>
            <Plus className="h-6 w-6" />
          </Button>
        </div>

        <p className="mt-4 text-sm text-muted-foreground">Choose between 1 to 50 questions</p>
      </div>

      <Button
        onClick={onGenerate}
        disabled={disabled}
        className="mt-7 h-16 w-full rounded-md text-lg font-extrabold shadow-[0_10px_22px_rgba(91,50,223,0.18)]"
      >
        <Sparkles className="h-5 w-5" />
        {generating ? "Generating..." : "Generate MCQs"}
      </Button>

      <div className="mt-8 flex gap-4 rounded-lg border border-primary/20 bg-primary/5 p-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Lightbulb className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-extrabold">How it works</h3>
          <p className="mt-2 leading-6 text-muted-foreground">We&apos;ll generate high-quality MCQs from the content of your selected document.</p>
        </div>
      </div>
    </section>
  );
}
