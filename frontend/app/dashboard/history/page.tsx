"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, Clock3, FileText, XCircle } from "lucide-react";

import { api } from "@/lib/api";
import type { MCQProgress, MCQTest, MCQTestSummary } from "@/lib/types";

function formatDate(value: string | null | undefined) {
  return value ? new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(value)) : "—";
}

export default function HistoryPage() {
  const [tests, setTests] = useState<MCQTestSummary[]>([]);
  const [progress, setProgress] = useState<MCQProgress | null>(null);
  const [selectedTest, setSelectedTest] = useState<MCQTest | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([api.getMCQTests(), api.getMCQProgress()])
      .then(([nextTests, nextProgress]) => { setTests(nextTests); setProgress(nextProgress); })
      .catch((requestError) => setError(requestError instanceof Error ? requestError.message : "Unable to load test history."));
  }, []);

  async function openTest(testId: string) {
    try { setError(""); setSelectedTest(await api.getMCQTest(testId)); }
    catch (requestError) { setError(requestError instanceof Error ? requestError.message : "Unable to load test details."); }
  }

  if (selectedTest) return <div className="space-y-6"><button type="button" onClick={() => setSelectedTest(null)} className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" />Back to history</button><header><p className="text-sm font-semibold text-primary">Test review</p><h1 className="mt-2 text-3xl font-bold">{selectedTest.document.title}</h1><p className="mt-2 text-muted-foreground">Completed {formatDate(selectedTest.completedAt)}</p></header><div className="grid gap-3 sm:grid-cols-4"><Stat label="Score" value={`${selectedTest.score}%`} /><Stat label="Correct" value={String(selectedTest.correctAnswers)} /><Stat label="Wrong" value={String(selectedTest.wrongAnswers)} /><Stat label="Unanswered" value={String(selectedTest.unansweredQuestions)} /></div><div className="space-y-3">{selectedTest.questions.map((question, index) => <article key={question.id} className="recall-panel p-5"><div className="flex items-start justify-between gap-4"><div><p className="text-sm font-semibold text-primary">Question {index + 1}</p><h2 className="mt-2 font-bold">{question.question}</h2></div>{question.isCorrect ? <CheckCircle2 className="size-5 shrink-0 text-emerald-600" /> : <XCircle className="size-5 shrink-0 text-red-600" />}</div><div className="mt-4 space-y-1 text-sm"><p><b>Your answer:</b> {question.selectedAnswer ?? "Unanswered"}</p><p><b>Correct answer:</b> {question.correctAnswer}</p><p className="text-muted-foreground"><b className="text-foreground">Explanation:</b> {question.explanation}</p></div></article>)}</div></div>;

  return <div className="space-y-8"><header><p className="text-sm font-semibold text-primary">Progress</p><h1 className="mt-2 text-4xl font-bold tracking-tight">Test History</h1><p className="mt-3 text-muted-foreground">Review your completed MCQ attempts and actual saved progress.</p></header>{error && <p role="alert" className="text-sm font-medium text-destructive">{error}</p>}<section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><Stat label="Completed tests" value={String(progress?.totalCompletedTests ?? 0)} /><Stat label="Questions attempted" value={String(progress?.totalQuestionsAttempted ?? 0)} /><Stat label="Correct answers" value={String(progress?.totalCorrectAnswers ?? 0)} /><Stat label="Overall accuracy" value={`${progress?.overallAccuracy ?? 0}%`} /></section><section className="recall-panel p-6"><div className="flex items-center gap-3"><Clock3 className="size-5 text-primary" /><h2 className="text-xl font-bold">Recent attempts</h2></div>{!tests.length ? <p className="mt-6 text-center text-sm text-muted-foreground">No completed tests yet.</p> : <div className="mt-5 space-y-2">{tests.map((test) => <button key={test.id} type="button" onClick={() => openTest(test.id)} className="flex w-full items-center justify-between gap-4 rounded-lg border border-border p-4 text-left transition hover:border-primary hover:bg-muted"><span className="flex min-w-0 items-center gap-3"><FileText className="size-5 shrink-0 text-primary" /><span className="min-w-0"><b className="block truncate">{test.document.title}</b><span className="text-sm text-muted-foreground">{formatDate(test.completedAt)} · {test.totalQuestions} questions</span></span></span><span className="shrink-0 text-right"><b className="text-primary">{test.score}%</b><span className="block text-xs text-muted-foreground">{test.correctAnswers} correct</span></span></button>)}</div>}</section></div>;
}

function Stat({ label, value }: { label: string; value: string }) { return <div className="recall-panel p-5"><p className="text-sm text-muted-foreground">{label}</p><p className="mt-2 text-3xl font-bold text-primary">{value}</p></div>; }
