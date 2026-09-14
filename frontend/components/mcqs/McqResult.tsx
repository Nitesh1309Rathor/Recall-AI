"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, ClipboardList, RotateCcw, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { MCQ } from "@/lib/types";

import { McqCard } from "./McqCard";

interface McqResultsProps {
  questions: MCQ[];
  onClear: () => void;
  quizMode?: boolean;
}

export function McqResults({ questions, onClear, quizMode = false }: McqResultsProps) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = answers[currentQuestionIndex];
  const isFirstQuestion = currentQuestionIndex === 0;
  const isFinalQuestion = currentQuestionIndex === questions.length - 1;
  const score = questions.reduce((total, question, index) => total + Number(answers[index] === question.correctAnswer), 0);

  function resetQuiz() {
    setAnswers({});
    setSubmitted(false);
    setCurrentQuestionIndex(0);
  }

  function clearResults() {
    resetQuiz();
    onClear();
  }

  function nextQuestion() {
    if (!submitted && !currentAnswer) return;
    if (isFinalQuestion) return;

    setCurrentQuestionIndex((index) => index + 1);
  }

  function submitQuiz() {
    if (!currentAnswer) return;
    setSubmitted(true);
  }

  function previousQuestion() {
    setCurrentQuestionIndex((index) => Math.max(0, index - 1));
  }

  return (
    <section className={quizMode ? "pb-8" : "mt-5 rounded-lg border border-border bg-card p-6 shadow-[0_18px_35px_rgba(30,41,59,0.08)]"}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-extrabold">{quizMode ? "Quiz" : "Generated MCQs"}</h2>
          {quizMode && <p className="mt-1 text-sm text-muted-foreground">Answer each question before moving on.</p>}
        </div>

        <Button variant="outline" className="h-10 px-4 text-sm font-bold" onClick={clearResults} disabled={!questions.length}>
          <Trash2 className="h-4 w-4" />
          {quizMode ? "Exit quiz" : "Clear Results"}
        </Button>
      </div>

      {!questions.length ? (
        <div className="flex min-h-[205px] flex-col items-center justify-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-lg border-4 border-primary/50 text-primary">
            <ClipboardList className="h-12 w-12" />
          </div>
          <h3 className="mt-5 text-xl font-extrabold">Your MCQs will appear here</h3>
          <p className="mt-3 text-sm text-muted-foreground">Select a document and click &quot;Generate MCQs&quot; to get started.</p>
        </div>
      ) : (
        <div className={quizMode ? "mx-auto mt-6 w-full max-w-3xl" : "mt-6"}>
          {submitted && (
            <div className="mb-5 flex shrink-0 flex-col gap-4 rounded-lg border border-emerald-500/40 bg-emerald-50 p-5 dark:bg-emerald-950/30 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-7 w-7 shrink-0 text-emerald-600" />
                <div>
                  <p className="font-extrabold text-emerald-950 dark:text-emerald-100">Test complete</p>
                  <p className="text-sm text-emerald-800 dark:text-emerald-200">You scored {score} out of {questions.length} ({Math.round((score / questions.length) * 100)}%).</p>
                </div>
              </div>
              <Button type="button" variant="outline" onClick={resetQuiz} className="border-emerald-500/40 text-emerald-800 dark:text-emerald-200">
                <RotateCcw className="h-4 w-4" />
                Retake test
              </Button>
            </div>
          )}

          {currentQuestion && (
            <div>
              <div className="mb-5">
                <div className="flex items-center justify-between gap-4 text-sm font-semibold">
                  <p>Question {currentQuestionIndex + 1} of {questions.length}</p>
                  <p className="text-muted-foreground">{Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%</p>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted" aria-hidden="true">
                  <div className="h-full rounded-full bg-primary transition-[width] duration-200" style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }} />
                </div>
              </div>

              <div>
                <McqCard
                  key={`${currentQuestion.question}-${currentQuestionIndex}`}
                  mcq={currentQuestion}
                  index={currentQuestionIndex}
                  selectedAnswer={currentAnswer}
                  submitted={submitted}
                  onSelect={(answer) => setAnswers((current) => ({ ...current, [currentQuestionIndex]: answer }))}
                />
              </div>

              <div className="mt-5 flex items-center justify-between gap-3">
                <Button type="button" variant="outline" onClick={previousQuestion} disabled={isFirstQuestion}>
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </Button>

                {isFinalQuestion ? (
                  <Button type="button" onClick={submitQuiz} disabled={submitted || !currentAnswer}>
                    {submitted ? "Test submitted" : "Submit Test"}
                  </Button>
                ) : (
                  <Button type="button" onClick={nextQuestion} disabled={!submitted && !currentAnswer}>
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
