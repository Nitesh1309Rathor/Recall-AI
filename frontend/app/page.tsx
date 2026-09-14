"use client";

import { useState } from "react";
import { Bell, BookOpen, ClipboardList, Clock3, FileText, Trophy } from "lucide-react";

import { UploadPdf } from "@/components/docs/UploadPdf";
import { DocumentList } from "@/components/docs/DocumentList";
import { McqSettings } from "@/components/mcqs/McqsSetting";
import { McqResults } from "@/components/mcqs/McqResult";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { api } from "@/lib/api";
import type { Document, MCQ } from "@/lib/types";

export default function Home() {
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);

  const [count, setCount] = useState(10);

  const [questions, setQuestions] = useState<MCQ[]>([]);

  const [generating, setGenerating] = useState(false);

  const [refreshKey, setRefreshKey] = useState(0);

  const [error, setError] = useState<string | null>(null);

  function handleUploaded(document: Document) {
    setSelectedDocumentId(document.id);

    setRefreshKey((value) => value + 1);

    setError(null);
  }

  async function handleGenerate() {
    if (!selectedDocumentId) {
      setError("Please select a document first.");
      return;
    }

    try {
      setError(null);
      setGenerating(true);
      setQuestions([]);

      const result = await api.generateMCQs(selectedDocumentId, count);

      setQuestions(result.questions);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to generate MCQs.");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <main className="h-dvh overflow-hidden bg-background text-foreground">
      <div className="flex h-full">
        <aside className="hidden h-full w-[296px] shrink-0 overflow-y-auto border-r border-border bg-card px-5 py-8 shadow-[18px_0_45px_rgba(30,41,59,0.08)] lg:flex lg:flex-col">
          <div className="flex items-center gap-4 px-2">
            <div className="flex h-11 w-11 items-center justify-center rounded-md border border-primary/20 bg-card text-primary shadow-sm">
              <BookOpen className="h-7 w-7" strokeWidth={2.3} />
            </div>
            <div>
              <p className="text-2xl font-extrabold leading-none tracking-wide">
                RECALL <span className="text-primary">AI</span>
              </p>
              <p className="mt-2 text-sm text-muted-foreground">Level up your learning.</p>
            </div>
          </div>

          <nav className="mt-14 space-y-5">
            <button className="flex h-14 w-full items-center gap-4 rounded-lg border border-primary/20 bg-primary/10 px-5 text-left text-sm font-bold text-primary shadow-sm">
              <ClipboardList className="h-5 w-5" />
              Generate MCQs
            </button>
            <button className="flex h-11 w-full items-center gap-4 rounded-lg px-5 text-left text-sm font-bold transition hover:bg-muted">
              <FileText className="h-5 w-5" />
              Documents
            </button>
            <button className="flex h-11 w-full items-center gap-4 rounded-lg px-5 text-left text-sm font-bold transition hover:bg-muted">
              <Clock3 className="h-5 w-5" />
              History
            </button>
          </nav>

          <div className="mt-auto rounded-lg border border-primary/20 bg-primary/5 p-5 shadow-sm">
            <Trophy className="h-7 w-7 text-primary" />
            <p className="mt-6 text-base font-extrabold leading-6">Keep learning, keep growing!</p>
            <p className="mt-5 text-sm leading-6 text-muted-foreground">Complete quizzes and earn XP.</p>
          </div>
        </aside>

        <div className="min-w-0 flex-1 overflow-y-auto px-5 py-5 md:px-9 lg:px-14">
          <header className="sticky top-0 z-20 flex items-center justify-between gap-4 bg-background/95 py-1 backdrop-blur">
            <div className="flex items-center gap-3 lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-md border border-primary/20 bg-card text-primary">
                <BookOpen className="h-6 w-6" />
              </div>
              <div className="font-extrabold tracking-wide">
                RECALL <span className="text-primary">AI</span>
              </div>
            </div>

            <div className="ml-auto flex items-center gap-3">
              <ThemeToggle />
              <button className="flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-card shadow-sm transition hover:bg-muted" aria-label="Notifications">
                <Bell className="h-5 w-5" />
              </button>
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/15 font-bold text-primary">S</div>
            </div>
          </header>

          <div className="mx-auto mt-1 w-full max-w-[1150px] py-6">
            {questions.length ? (
              <McqResults key={questions.map((question) => question.question).join("|")} questions={questions} onClear={() => setQuestions([])} quizMode />
            ) : (
              <>
                <div className="mb-6 shrink-0">
                  <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Generate MCQs</h1>
                  <p className="mt-3 text-base text-muted-foreground">Upload a document or choose from your existing documents to generate MCQs.</p>
                </div>

                <div className="grid shrink-0 gap-5 xl:grid-cols-[1.04fr_1fr]">
                  <section className="rounded-lg border border-border bg-card p-7 shadow-[0_18px_35px_rgba(30,41,59,0.08)]">
                    <UploadPdf onUploaded={handleUploaded} />

                    <div className="mt-7">
                      <h2 className="mb-4 text-sm font-extrabold">Your Documents</h2>
                      <DocumentList selectedDocumentId={selectedDocumentId} onSelect={(document) => setSelectedDocumentId(document.id)} refreshKey={refreshKey} />
                    </div>
                  </section>

                  <McqSettings count={count} onCountChange={setCount} onGenerate={handleGenerate} disabled={generating || !selectedDocumentId} generating={generating} />
                </div>

                {error && <p className="mt-4 shrink-0 text-sm font-medium text-destructive">{error}</p>}

                <McqResults questions={questions} onClear={() => setQuestions([])} />
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
