"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Bookmark, CheckCircle2, FileText, Play, RotateCcw, Star, XCircle } from "lucide-react";

import { api } from "@/lib/api";
import type { Document, MCQ } from "@/lib/types";

type Answers = Record<number, string>;

function scoreTest(questions: MCQ[], answers: Answers) {
  const correct = questions.reduce((total, question, index) => total + Number(answers[index] === question.correctAnswer), 0);
  const answered = questions.reduce((total, _question, index) => total + Number(Boolean(answers[index])), 0);
  return { correct, answered, incorrect: answered - correct, unanswered: questions.length - answered, percentage: questions.length ? Math.round((correct / questions.length) * 100) : 0 };
}

export default function McqsPage() {
  const [docs, setDocs] = useState<Document[]>([]);
  const [docId, setDocId] = useState("");
  const [count, setCount] = useState(10);
  const [difficulty, setDifficulty] = useState("Medium");
  const [questions, setQuestions] = useState<MCQ[]>([]);
  const [answers, setAnswers] = useState<Answers>({});
  const [bookmarked, setBookmarked] = useState<Set<number>>(new Set());
  const [index, setIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getDocuments().then((items) => { setDocs(items); setDocId(items[0]?.id ?? ""); }).catch((requestError) => setError(requestError instanceof Error ? requestError.message : "Unable to load documents."));
  }, []);

  async function generate() {
    if (!docId) return;
    setLoading(true); setError("");
    try {
      const result = await api.generateMCQs(docId, count);
      setQuestions(result.questions); setAnswers({}); setBookmarked(new Set()); setIndex(0); setSubmitted(false);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to generate MCQs.");
    } finally { setLoading(false); }
  }

  function retake() { setAnswers({}); setBookmarked(new Set()); setIndex(0); setSubmitted(false); setError(""); }

  function submitTest() {
    if (submitted || loading) return;
    const unanswered = questions.length - Object.keys(answers).length;
    const message = unanswered ? `You have ${unanswered} unanswered question${unanswered === 1 ? "" : "s"}. Submit the test anyway?` : "Submit your test and see your results?";
    if (!window.confirm(message)) return;
    setSubmitted(true);
  }

  const current = questions[index];
  const result = useMemo(() => scoreTest(questions, answers), [questions, answers]);
  const progress = questions.length ? Math.round((result.answered / questions.length) * 100) : 0;

  return <div className="space-y-8">
    <header className="flex items-start gap-5"><div className="flex size-16 items-center justify-center rounded-xl bg-muted text-primary"><FileText className="size-8" /></div><div><h1 className="text-4xl font-bold tracking-tight">Practice MCQs</h1><p className="mt-2 text-lg text-muted-foreground">Test your understanding with AI-generated multiple choice questions.</p></div></header>

    <section className="grid gap-4 lg:grid-cols-[1.3fr_.7fr_.7fr_auto]"><select value={docId} onChange={(event) => setDocId(event.target.value)} disabled={loading || questions.length > 0 && !submitted} className="h-14 rounded-xl border border-border bg-card px-4 text-base font-semibold"><option value="">Select a document</option>{docs.map((doc) => <option key={doc.id} value={doc.id}>{doc.title}</option>)}</select><select value={count} onChange={(event) => setCount(Number(event.target.value))} disabled={loading || questions.length > 0 && !submitted} className="h-14 rounded-xl border border-border bg-card px-4 text-base"><option value={5}>5 Questions</option><option value={10}>10 Questions</option><option value={20}>20 Questions</option></select><select value={difficulty} onChange={(event) => setDifficulty(event.target.value)} disabled={loading || questions.length > 0 && !submitted} className="h-14 rounded-xl border border-border bg-card px-4 text-base"><option>Easy</option><option>Medium</option><option>Hard</option></select><button onClick={generate} disabled={loading || !docId} className="flex h-14 items-center justify-center gap-2 rounded-xl bg-primary px-6 font-semibold text-primary-foreground disabled:opacity-50"><Play className="size-5" />{loading ? "Generating..." : "Generate MCQs"}</button></section>
    {error && <p role="alert" className="text-sm font-medium text-destructive">{error}</p>}

    {!questions.length && <div className="recall-panel flex min-h-[360px] flex-col items-center justify-center text-center"><FileText className="size-12 text-primary" /><h2 className="mt-5 text-2xl font-bold">Choose a document to begin</h2><p className="mt-2 text-muted-foreground">Select your material above and generate a focused practice set.</p></div>}

    {questions.length > 0 && !submitted && current && <section className="grid gap-7 xl:grid-cols-[1fr_360px]"><section className="recall-panel p-7 md:p-9"><div className="flex items-center justify-between"><span className="rounded-lg bg-muted px-4 py-2 text-sm font-semibold text-primary">Question {index + 1} of {questions.length}</span><button type="button" aria-label={bookmarked.has(index) ? "Remove bookmark" : "Bookmark question"} title={bookmarked.has(index) ? "Remove bookmark" : "Bookmark question"} onClick={() => setBookmarked((currentBookmarks) => { const next = new Set(currentBookmarks); if (next.has(index)) next.delete(index); else next.add(index); return next; })} className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-primary">{bookmarked.has(index) ? <Star className="size-6 fill-current text-primary" /> : <Bookmark className="size-6" />}</button></div><h2 className="mt-9 text-2xl font-bold leading-snug">{current.question}</h2><div className="mt-8 space-y-3">{current.options.map((option, optionIndex) => { const selected = answers[index] === option; return <button key={option} type="button" onClick={() => setAnswers((currentAnswers) => ({ ...currentAnswers, [index]: option }))} className={`flex w-full items-center gap-4 rounded-xl border px-5 py-4 text-left text-base transition ${selected ? "border-primary bg-primary/10" : "border-border hover:border-primary/50 hover:bg-muted/50"}`}><span className={`flex size-6 items-center justify-center rounded-full border ${selected ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/40 text-transparent"}`}>{selected && <CheckCircle2 className="size-4" />}</span><span className="font-semibold text-muted-foreground">{String.fromCharCode(65 + optionIndex)}.</span><span>{option}</span></button>; })}</div><div className="mt-10 flex items-center justify-between gap-3"><button type="button" disabled={index === 0} onClick={() => setIndex((value) => value - 1)} className="flex items-center gap-2 rounded-lg border border-border px-5 py-3 font-semibold transition hover:bg-muted disabled:opacity-40"><ArrowLeft className="size-4" />Previous</button>{index === questions.length - 1 ? <button type="button" onClick={submitTest} disabled={loading} className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground disabled:opacity-50">Submit Test</button> : <button type="button" onClick={() => setIndex((value) => value + 1)} className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground">Next<ArrowRight className="size-4" /></button>}</div></section><aside className="recall-panel h-fit p-7"><div className="flex items-center justify-between"><h2 className="text-2xl font-bold">Your Progress</h2><span className="text-sm font-semibold text-muted-foreground">{progress}%</span></div><div className="mt-6 h-3 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary transition-[width] duration-200" style={{ width: `${progress}%` }} /></div><div className="mt-7 grid grid-cols-2 gap-3"><div className="rounded-xl bg-muted p-4 text-center"><b className="text-2xl">{result.answered}</b><p className="mt-1 text-sm text-muted-foreground">Answered</p></div><div className="rounded-xl bg-muted p-4 text-center"><b className="text-2xl">{result.unanswered}</b><p className="mt-1 text-sm text-muted-foreground">Remaining</p></div></div><button type="button" onClick={submitTest} className="mt-6 w-full rounded-lg border border-border px-4 py-3 text-sm font-semibold transition hover:bg-muted">Submit test</button></aside></section>}

    {questions.length > 0 && submitted && <section className="space-y-6"><div className="recall-panel p-7"><div className="flex flex-col justify-between gap-5 md:flex-row md:items-center"><div><p className="text-sm font-semibold uppercase tracking-wide text-primary">Test complete</p><h2 className="mt-2 text-3xl font-bold">Your results</h2><p className="mt-2 text-muted-foreground">Final score based on the answer key returned with the generated questions.</p></div><div className="text-left md:text-right"><p className="text-5xl font-black text-primary">{result.percentage}%</p><p className="mt-1 text-sm text-muted-foreground">{result.correct} of {questions.length} correct</p></div></div><div className="mt-7 grid gap-3 sm:grid-cols-4"><div className="rounded-xl bg-muted p-4"><p className="text-2xl font-bold">{questions.length}</p><p className="text-sm text-muted-foreground">Total questions</p></div><div className="rounded-xl bg-emerald-500/10 p-4"><p className="text-2xl font-bold text-emerald-600">{result.correct}</p><p className="text-sm text-muted-foreground">Correct</p></div><div className="rounded-xl bg-red-500/10 p-4"><p className="text-2xl font-bold text-red-600">{result.incorrect}</p><p className="text-sm text-muted-foreground">Incorrect</p></div><div className="rounded-xl bg-muted p-4"><p className="text-2xl font-bold">{result.unanswered}</p><p className="text-sm text-muted-foreground">Unanswered</p></div></div><div className="mt-6 flex flex-wrap gap-3"><button type="button" onClick={retake} className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground"><RotateCcw className="size-4" />Retake Test</button><Link href="/dashboard" className="inline-flex items-center rounded-lg border border-border px-5 py-3 font-semibold hover:bg-muted">Back to Dashboard</Link></div></div><div className="space-y-4"><h2 className="text-2xl font-bold">Answer Review</h2>{questions.map((question, questionIndex) => { const selected = answers[questionIndex]; const correct = selected === question.correctAnswer; return <article key={`${question.question}-${questionIndex}`} className="recall-panel p-6"><div className="flex items-start justify-between gap-4"><div><p className="text-sm font-semibold text-primary">Question {questionIndex + 1}</p><h3 className="mt-2 text-lg font-bold">{question.question}</h3></div>{correct ? <CheckCircle2 className="size-6 shrink-0 text-emerald-600" /> : <XCircle className="size-6 shrink-0 text-red-600" />}</div><div className="mt-4 grid gap-2 text-sm"><p><span className="font-semibold">Your answer:</span> {selected ?? "Unanswered"}</p><p><span className="font-semibold">Correct answer:</span> {question.correctAnswer}</p><p className="text-muted-foreground"><span className="font-semibold text-foreground">Explanation:</span> {question.explanation}</p></div></article>; })}</div></section>}
  </div>;
}
