"use client";

import { CheckCircle2, Circle, XCircle } from "lucide-react";

import { Card } from "@/components/ui/card";
import type { MCQ } from "@/lib/types";

interface McqCardProps {
  mcq: MCQ;
  index: number;
  selectedAnswer?: string;
  submitted: boolean;
  onSelect: (answer: string) => void;
}

export function McqCard({ mcq, index, selectedAnswer, submitted, onSelect }: McqCardProps) {
  const isCorrect = selectedAnswer === mcq.correctAnswer;

  return (
    <Card className="p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-primary">Question {index + 1}</p>

      <h3 className="mt-2 text-base font-semibold leading-6">{mcq.question}</h3>

      <div className="mt-4 space-y-2" role="radiogroup" aria-label={`Question ${index + 1} options`}>
        {mcq.options.map((option, optionIndex) => {
          const isSelected = selectedAnswer === option;
          const isCorrectOption = option === mcq.correctAnswer;
          const optionState = submitted
            ? isCorrectOption
              ? "border-emerald-500 bg-emerald-50 text-emerald-950 dark:bg-emerald-950/30 dark:text-emerald-100"
              : isSelected
                ? "border-red-500 bg-red-50 text-red-950 dark:bg-red-950/30 dark:text-red-100"
                : "border-border"
            : isSelected
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50 hover:bg-muted/50";

          return (
            <button
              key={`${option}-${optionIndex}`}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={submitted}
              onClick={() => onSelect(option)}
              className={`flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition ${optionState} disabled:cursor-default`}
            >
              {submitted && isCorrectOption ? (
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" aria-hidden="true" />
              ) : submitted && isSelected ? (
                <XCircle className="h-5 w-5 shrink-0 text-red-600" aria-hidden="true" />
              ) : isSelected ? (
                <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
              ) : (
                <Circle className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
              )}
              <span className="font-semibold text-muted-foreground">{String.fromCharCode(65 + optionIndex)}.</span>
              <span>{option}</span>
            </button>
          );
        })}
      </div>

      {submitted && (
        <div className={`mt-4 rounded-lg p-3 text-sm ${isCorrect ? "bg-emerald-50 text-emerald-950 dark:bg-emerald-950/30 dark:text-emerald-100" : "bg-red-50 text-red-950 dark:bg-red-950/30 dark:text-red-100"}`}>
          <p className="font-semibold">{isCorrect ? "Correct" : `Correct answer: ${mcq.correctAnswer}`}</p>
          <p className="mt-1 opacity-80">{mcq.explanation}</p>
        </div>
      )}
    </Card>
  );
}
