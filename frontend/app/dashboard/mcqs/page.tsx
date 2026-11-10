"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Bookmark, CheckCircle2, ChevronDown, ChevronUp, FileText, MinusCircle, Play, Plus, RotateCcw, Search, Star, Trash2, XCircle } from "lucide-react";

import { api } from "@/lib/api";
import type { Document, MCQTest, MCQTestQuestion, MCQTestSummary } from "@/lib/types";

type Answers = Record<number, string>;
type Difficulty = "Easy" | "Medium" | "Hard";

function scoreTest(questions: MCQTestQuestion[], answers: Answers) {
  const correct = questions.reduce((total, question, index) => total + Number(answers[index] === question.correctAnswer), 0);
  const answered = questions.reduce((total, _question, index) => total + Number(Boolean(answers[index])), 0);
  return {
    correct,
    answered,
    incorrect: answered - correct,
    unanswered: questions.length - answered,
    percentage: questions.length ? Math.round((correct / questions.length) * 100) : 0,
  };
}

export default function McqsPage() {
  const [screen, setScreen] = useState<"list" | "generate">("list");
  const [docs, setDocs] = useState<Document[]>([]);
  const [docId, setDocId] = useState("");
  const [countInput, setCountInput] = useState("10");
  const [difficulty, setDifficulty] = useState<Difficulty>("Medium");
  const [questions, setQuestions] = useState<MCQTestQuestion[]>([]);
  const [answers, setAnswers] = useState<Answers>({});
  const [bookmarked, setBookmarked] = useState<Set<number>>(new Set());
  const [index, setIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [testId, setTestId] = useState("");
  const [savedResult, setSavedResult] = useState<MCQTest | null>(null);
  const [savedTests, setSavedTests] = useState<MCQTestSummary[]>([]);
  const [expandedReview, setExpandedReview] = useState<number | null>(null);
  const [testSearch, setTestSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([api.getDocuments(), api.getMCQTests()])
      .then(([items, tests]) => { setDocs(items); setSavedTests(tests); })
      .catch((requestError) => setError(requestError instanceof Error ? requestError.message : "Unable to load MCQ data."));
  }, []);

  useEffect(() => {
    const storedTestId = window.localStorage.getItem("recall-active-mcq-test");
    if (!storedTestId) return;
    api.getMCQTest(storedTestId).then((savedTest) => {
      setTestId(savedTest.id);
      setDocId(savedTest.documentId);
      setQuestions(savedTest.questions);
      setAnswers(Object.fromEntries(savedTest.questions.map((question, questionIndex) => [questionIndex, question.selectedAnswer ?? ""])));
      setSavedResult(savedTest.status === "COMPLETED" ? savedTest : null);
      setSubmitted(savedTest.status === "COMPLETED");
    }).catch(() => window.localStorage.removeItem("recall-active-mcq-test"));
  }, []);

  async function refreshSavedTests() {
    setSavedTests(await api.getMCQTests());
  }

  async function generate() {
    const count = Number(countInput);

    if (!docId) {
      setError("Please select a document first.");
      return;
    }

    if (!/^[1-9]\d*$/.test(countInput) || count < 1 || count > 50) {
      setError("Question count must be a whole number between 1 and 50.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const result = await api.generateMCQTest(docId, count, difficulty);
      setTestId(result.id);
      window.localStorage.setItem("recall-active-mcq-test", result.id);
      setQuestions(result.questions);
      setSavedResult(null);
      setAnswers({});
      setBookmarked(new Set());
      setIndex(0);
      setSubmitted(false);
      setScreen("list");
      await refreshSavedTests();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to generate MCQs.");
    } finally {
      setLoading(false);
    }
  }

  function retake() {
    setAnswers({});
    setBookmarked(new Set());
    setIndex(0);
    setSubmitted(false);
    setError("");
    setSavedResult(null);
  }

  function clearSession() {
    window.localStorage.removeItem("recall-active-mcq-test");
    setQuestions([]);
    setAnswers({});
    setBookmarked(new Set());
    setIndex(0);
    setSubmitted(false);
    setTestId("");
    setSavedResult(null);
  }

  async function submitTest() {
    if (submitted || loading) return;
    const unanswered = questions.length - Object.keys(answers).length;
    const message = unanswered
      ? `You have ${unanswered} unanswered question${unanswered === 1 ? "" : "s"}. Submit the test anyway?`
      : "Submit your test and see your results?";
    if (!window.confirm(message)) return;
    try {
      setLoading(true);
      setError("");
      const result = await api.submitMCQTest(testId, questions.map((question, questionIndex) => ({ questionId: question.id, selectedAnswer: answers[questionIndex] ?? null })));
      setSavedResult(result);
      setSubmitted(true);
      await refreshSavedTests();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to submit test.");
    } finally {
      setLoading(false);
    }
  }

  async function openSavedTest(savedTestId: string) {
    try {
      setLoading(true);
      setError("");
      const savedTest = await api.getMCQTest(savedTestId);
      setTestId(savedTest.id);
      window.localStorage.setItem("recall-active-mcq-test", savedTest.id);
      setDocId(savedTest.documentId);
      setQuestions(savedTest.questions);
      setAnswers(Object.fromEntries(savedTest.questions.map((question, index) => [index, question.selectedAnswer ?? ""])));
      setIndex(0);
      setSavedResult(savedTest.status === "COMPLETED" ? savedTest : null);
      setSubmitted(savedTest.status === "COMPLETED");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to open saved test.");
    } finally {
      setLoading(false);
    }
  }

  async function deleteSavedTest(savedTestId: string) {
    if (!window.confirm("Delete this MCQ test attempt and all of its saved questions?")) return;
    try {
      await api.deleteMCQTest(savedTestId);
      if (savedTestId === window.localStorage.getItem("recall-active-mcq-test")) window.localStorage.removeItem("recall-active-mcq-test");
      if (savedTestId === testId) clearSession();
      await refreshSavedTests();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to delete saved test.");
    }
  }

  const current = questions[index];
  const result = useMemo(() => scoreTest(questions, answers), [questions, answers]);
  const progress = questions.length ? Math.round((result.answered / questions.length) * 100) : 0;

  return (
    <div className="space-y-8">
      <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div className="flex items-center gap-5">
        <div className="flex size-16 items-center justify-center rounded-xl bg-primary/15 text-primary">
          <FileText className="size-8" />
        </div>
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Practice MCQs</h1>
          <p className="mt-2 text-lg text-muted-foreground">Practice and review your saved MCQ tests.</p>
        </div>
        </div>
        {screen === "list" && !questions.length && (
          <button type="button" onClick={() => setScreen("generate")} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-5 font-semibold text-primary-foreground shadow-lg shadow-primary/20">
            <Plus className="size-5" /> Generate MCQs
          </button>
        )}
      </header>

      {screen === "generate" && !questions.length && <button type="button" onClick={() => setScreen("list")} className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 font-semibold hover:bg-muted"><ArrowLeft className="size-4" /> Back</button>}

      {screen === "generate" && <section className="recall-panel w-full max-w-none p-5 md:p-7">
        <div className="mb-6 flex items-center gap-4">
          <div className="flex size-14 items-center justify-center rounded-xl bg-primary/15 text-primary"><FileText className="size-7" /></div>
          <div><h2 className="text-2xl font-bold">Generate Practice MCQs</h2><p className="mt-1 text-muted-foreground">Select a document and configure your test.</p></div>
        </div>
      <section className="grid gap-4 md:grid-cols-[1fr_1fr]">
        <select
          value={docId}
          onChange={(event) => {
            clearSession();
            setDocId(event.target.value);
            setError("");
          }}
          disabled={loading || (questions.length > 0 && !submitted)}
          className="h-14 rounded-xl border border-border bg-card px-4 text-base font-semibold md:col-span-2"
        >
          <option value="">Select a document</option>
          {docs.map((doc) => (
            <option key={doc.id} value={doc.id}>
              {doc.title}
            </option>
          ))}
        </select>
        <div className="flex h-14 items-center justify-between rounded-xl border border-border bg-card px-3">
          <button
            type="button"
            aria-label="Decrease question count"
            onClick={() => {
              clearSession();
              setCountInput((value) => String(Math.max(1, Number(value || 1) - 1)));
              setError("");
            }}
            disabled={loading || (questions.length > 0 && !submitted) || countInput === "1"}
            className="flex size-9 items-center justify-center rounded-lg text-xl font-bold text-primary transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
          >
            −
          </button>
          <input
            type="number"
            min={1}
            max={50}
            step={1}
            inputMode="numeric"
            aria-label="Question count"
            value={countInput}
            onChange={(event) => {
              clearSession();
              setCountInput(event.target.value);
              setError("");
            }}
            className="w-24 bg-transparent text-center text-base font-semibold outline-none"
            disabled={loading || (questions.length > 0 && !submitted)}
          />
          <span className="-ml-3 mr-1 whitespace-nowrap text-sm text-muted-foreground">Questions</span>
          <button
            type="button"
            aria-label="Increase question count"
            onClick={() => {
              clearSession();
              setCountInput((value) => String(Math.min(50, Number(value || 1) + 1)));
              setError("");
            }}
            disabled={loading || (questions.length > 0 && !submitted) || countInput === "50"}
            className="flex size-9 items-center justify-center rounded-lg text-xl font-bold text-primary transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
          >
            +
          </button>
        </div>
        <select
          value={difficulty}
          onChange={(event) => {
            clearSession();
            setDifficulty(event.target.value as Difficulty);
            setError("");
          }}
          disabled={loading || (questions.length > 0 && !submitted)}
          className="h-14 rounded-xl border border-border bg-card px-4 text-base"
        >
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>
        <button
          onClick={generate}
          disabled={loading || !docId}
          className="flex h-14 items-center justify-center gap-2 rounded-xl bg-primary px-6 font-semibold text-primary-foreground shadow-lg shadow-primary/20 disabled:opacity-50 md:col-span-2"
        >
          <Play className="size-5" />
          {loading ? "Generating..." : "Generate MCQs"}
        </button>
      </section>
      </section>}
      {error && (
        <p role="alert" className="text-sm font-medium text-destructive">
          {error}
        </p>
      )}

      {questions.length > 0 && !submitted && current && (
        <section className="grid gap-7 xl:grid-cols-[1fr_360px]">
          <section className="recall-panel p-7 md:p-9">
            <div className="flex items-center justify-between">
              <span className="rounded-lg bg-muted px-4 py-2 text-sm font-semibold text-primary">
                Question {index + 1} of {questions.length}
              </span>
              <button
                type="button"
                aria-label={bookmarked.has(index) ? "Remove bookmark" : "Bookmark question"}
                title={bookmarked.has(index) ? "Remove bookmark" : "Bookmark question"}
                onClick={() =>
                  setBookmarked((currentBookmarks) => {
                    const next = new Set(currentBookmarks);
                    if (next.has(index)) next.delete(index);
                    else next.add(index);
                    return next;
                  })
                }
                className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-primary"
              >
                {bookmarked.has(index) ? <Star className="size-6 fill-current text-primary" /> : <Bookmark className="size-6" />}
              </button>
            </div>
            <h2 className="mt-9 text-2xl font-bold leading-snug">{current.question}</h2>
            <div className="mt-8 space-y-3">
              {current.options.map((option, optionIndex) => {
                const selected = answers[index] === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setAnswers((currentAnswers) => ({ ...currentAnswers, [index]: option }))}
                    className={`flex w-full items-center gap-4 rounded-xl border px-5 py-4 text-left text-base transition ${selected ? "border-primary bg-primary/10" : "border-border hover:border-primary/50 hover:bg-muted/50"}`}
                  >
                    <span
                      className={`flex size-6 items-center justify-center rounded-full border ${selected ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/40 text-transparent"}`}
                    >
                      {selected && <CheckCircle2 className="size-4" />}
                    </span>
                    <span className="font-semibold text-muted-foreground">{String.fromCharCode(65 + optionIndex)}.</span>
                    <span>{option}</span>
                  </button>
                );
              })}
            </div>
            <div className="mt-10 flex items-center justify-between gap-3">
              <button
                type="button"
                disabled={index === 0}
                onClick={() => setIndex((value) => value - 1)}
                className="flex items-center gap-2 rounded-lg border border-border px-5 py-3 font-semibold transition hover:bg-muted disabled:opacity-40"
              >
                <ArrowLeft className="size-4" />
                Previous
              </button>
              {index === questions.length - 1 ? (
                <button
                  type="button"
                  onClick={submitTest}
                  disabled={loading}
                  className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground disabled:opacity-50"
                >
                  Submit Test
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIndex((value) => value + 1)}
                  className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground"
                >
                  Next
                  <ArrowRight className="size-4" />
                </button>
              )}
            </div>
          </section>
          <aside className="recall-panel h-fit p-7">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Your Progress</h2>
              <span className="text-sm font-semibold text-muted-foreground">{progress}%</span>
            </div>
            <div className="mt-6 h-3 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-primary transition-[width] duration-200" style={{ width: `${progress}%` }} />
            </div>
            <div className="mt-7 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-muted p-4 text-center">
                <b className="text-2xl">{result.answered}</b>
                <p className="mt-1 text-sm text-muted-foreground">Answered</p>
              </div>
              <div className="rounded-xl bg-muted p-4 text-center">
                <b className="text-2xl">{result.unanswered}</b>
                <p className="mt-1 text-sm text-muted-foreground">Remaining</p>
              </div>
            </div>
            <button
              type="button"
              onClick={submitTest}
              className="mt-6 w-full rounded-lg border border-border px-4 py-3 text-sm font-semibold transition hover:bg-muted"
            >
              Submit test
            </button>
          </aside>
        </section>
      )}

      {questions.length > 0 && submitted && (
        <section className="space-y-6">
          <div className="recall-panel p-7 md:p-10">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20"><CheckCircle2 className="size-10" /></div>
            <div className="mt-5 text-center"><h2 className="text-3xl font-bold">Test Completed!</h2><p className="mt-2 text-lg text-muted-foreground">You scored <span className="font-bold text-emerald-500">{savedResult?.score ?? result.percentage}%</span></p></div>
            <div className="mt-8 grid gap-3 sm:grid-cols-4">
              <div className="rounded-xl border border-border bg-muted/50 p-4 text-center">
                <CheckCircle2 className="mx-auto size-6 text-emerald-500" /><p className="mt-2 text-2xl font-bold">{savedResult?.correctAnswers ?? result.correct}</p><p className="text-sm text-muted-foreground">Correct</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/50 p-4 text-center">
                <XCircle className="mx-auto size-6 text-red-500" /><p className="mt-2 text-2xl font-bold">{savedResult?.wrongAnswers ?? result.incorrect}</p><p className="text-sm text-muted-foreground">Wrong</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/50 p-4 text-center">
                <MinusCircle className="mx-auto size-6 text-muted-foreground" /><p className="mt-2 text-2xl font-bold">{savedResult?.unansweredQuestions ?? result.unanswered}</p><p className="text-sm text-muted-foreground">Unanswered</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/50 p-4 text-center">
                <p className="text-2xl font-bold text-amber-400">{savedResult?.score ?? result.percentage}%</p><p className="mt-2 text-sm text-muted-foreground">Overall score</p>
              </div>
            </div>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={retake}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground"
              >
                <RotateCcw className="size-4" />
                Retake Test
              </button>
              <button type="button" onClick={() => { clearSession(); setScreen("list"); }} className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-3 font-semibold hover:bg-muted"><ArrowLeft className="size-4" /> Back</button>
            </div>
          </div>
          <div className="recall-panel overflow-hidden">
            <h2 className="border-b border-border px-5 py-4 text-xl font-bold">Review Your Answers</h2>
            {(savedResult?.questions ?? questions).map((question, questionIndex) => {
              const selected = savedResult?.questions ? question.selectedAnswer : answers[questionIndex];
              const status = selected == null || selected === "" ? "unanswered" : question.isCorrect === true || selected === question.correctAnswer ? "correct" : "incorrect";
              const open = expandedReview === questionIndex;
              return <article key={`${question.question}-${questionIndex}`} className="border-b border-border last:border-b-0">
                <button type="button" onClick={() => setExpandedReview(open ? null : questionIndex)} className="flex w-full items-center gap-4 px-5 py-4 text-left hover:bg-muted/40">
                  <span className="text-sm font-semibold text-muted-foreground">{questionIndex + 1}.</span><span className="min-w-0 flex-1 truncate font-medium">{question.question}</span>
                  <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${status === "correct" ? "bg-emerald-500/10 text-emerald-500" : status === "incorrect" ? "bg-red-500/10 text-red-500" : "bg-muted text-muted-foreground"}`}>{status === "correct" ? "✓ Correct" : status === "incorrect" ? "× Incorrect" : "− Unanswered"}</span>{open ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                </button>
                {open && <div className="grid gap-2 bg-muted/20 px-12 pb-5 pt-1 text-sm"><p><span className="font-semibold">Your answer:</span> {selected || "Unanswered"}</p><p><span className="font-semibold">Correct answer:</span> {question.correctAnswer}</p><p className="text-muted-foreground"><span className="font-semibold text-foreground">Explanation:</span> {question.explanation}</p></div>}
              </article>;
            })}
          </div>
        </section>
      )}

      {!questions.length && screen === "list" && <SavedTests tests={savedTests} search={testSearch} onSearchChange={setTestSearch} onOpen={openSavedTest} onDelete={deleteSavedTest} />}
    </div>
  );
}

function SavedTests({ tests, search, onSearchChange, onOpen, onDelete }: { tests: MCQTestSummary[]; search: string; onSearchChange: (value: string) => void; onOpen: (id: string) => void; onDelete: (id: string) => void }) {
  const [page, setPage] = useState(1);
  const filteredTests = tests.filter((test) => test.document.title.toLowerCase().includes(search.toLowerCase()));
  const pageSize = 6;
  const pageCount = Math.ceil(filteredTests.length / pageSize);
  const visibleTests = filteredTests.slice((page - 1) * pageSize, page * pageSize);
  return <section className="space-y-4 border-t border-border pt-8"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm font-semibold text-primary">Saved attempts</p><h2 className="mt-1 text-2xl font-bold">My MCQ Tests</h2><p className="mt-2 text-sm text-muted-foreground">Open a saved test to continue or review your answers.</p></div><label className="relative block sm:w-64"><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input value={search} onChange={(event) => { onSearchChange(event.target.value); setPage(1); }} placeholder="Search by document" className="h-10 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-sm outline-none focus:border-primary" /></label></div>{!filteredTests.length ? <div className="recall-panel p-6 text-center text-sm text-muted-foreground">No saved MCQ tests yet.</div> : <><div className="space-y-3">{visibleTests.map((test) => <article key={test.id} className="recall-panel flex items-center gap-4 p-5"><button type="button" onClick={() => onOpen(test.id)} className="min-w-0 flex-1 text-left"><strong className="block truncate">{test.document.title}</strong><span className="mt-1 block text-sm text-muted-foreground">{test.totalQuestions} questions · {new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(test.createdAt))}</span></button><span className={`hidden rounded-full px-3 py-1 text-xs font-semibold sm:inline-flex ${test.status === "COMPLETED" ? "bg-emerald-500/10 text-emerald-600" : "bg-primary/10 text-primary"}`}>{test.status === "COMPLETED" ? `${test.score}% · Completed` : "In Progress"}</span><button type="button" aria-label={`Delete test for ${test.document.title}`} onClick={() => onDelete(test.id)} className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-destructive"><Trash2 className="size-4" /></button></article>)}</div><div className="flex items-center justify-between border-t border-border pt-4 text-sm"><span className="text-muted-foreground">Page {page} of {pageCount}</span><div className="flex items-center gap-2"><button type="button" onClick={() => setPage(page - 1)} disabled={page === 1} className="rounded-lg border border-border px-3 py-2 font-semibold hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40">Previous</button><button type="button" onClick={() => setPage(page + 1)} disabled={page === pageCount} className="rounded-lg border border-border px-3 py-2 font-semibold hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40">Next</button></div></div></>}</section>;
}
