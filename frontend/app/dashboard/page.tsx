"use client";

import { useState } from "react";
import { ArrowRight, BookOpen, FileText, Sparkles } from "lucide-react";
import Link from "next/link";

import { AddDocumentPanel } from "@/components/docs/AddDocumentPanel";
import { DocumentList } from "@/components/docs/DocumentList";
import { McqSettings } from "@/components/mcqs/McqsSetting";
import { McqResults } from "@/components/mcqs/McqResult";
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

  function handleDeleted(document: Document) {
    if (document.id === selectedDocumentId) {
      setSelectedDocumentId(null);
      setQuestions([]);
    }
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
    <>
      <section className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div><p className="text-sm font-semibold text-primary">Thursday, November 5</p><h1 className="mt-2 text-4xl font-bold tracking-tight">Welcome back 👋</h1><p className="mt-3 text-slate-500">Pick up where you left off and keep your learning moving.</p></div>
        <Link href="/dashboard/documents" className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 font-semibold text-white shadow-[0_8px_18px_rgba(23,105,232,0.22)]">Add document <ArrowRight className="size-4"/></Link>
      </section>
      <section className="mb-8 grid gap-4 sm:grid-cols-3">
        {[{label:"Documents", value:"12", icon:FileText},{label:"Quizzes completed", value:"8", icon:Sparkles},{label:"Study streak", value:"4 days", icon:BookOpen}].map(({label,value,icon:Icon})=><div key={label} className="recall-panel flex items-center gap-4 p-5"><span className="flex size-11 items-center justify-center rounded-xl bg-[#e8f1ff] text-primary"><Icon className="size-5"/></span><div><p className="text-2xl font-bold">{value}</p><p className="mt-1 text-sm text-slate-500">{label}</p></div></div>)}
      </section>
      {questions.length ? (
        <McqResults key={questions.map((question) => question.question).join("|")} questions={questions} onClear={() => setQuestions([])} quizMode />
      ) : (
        <>
          <div className="mb-6">
            <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Generate MCQs</h1>
            <p className="mt-3 text-base text-muted-foreground">Upload a document or choose from your existing documents to generate MCQs.</p>
          </div>

          <div className="grid gap-5 xl:grid-cols-[1.04fr_1fr]">
            <section className="rounded-lg border border-border bg-card p-6 shadow-[0_18px_35px_rgba(30,41,59,0.08)] md:p-7">
              <AddDocumentPanel onAdded={handleUploaded} />

              <div className="mt-7">
                <h2 className="mb-4 text-sm font-extrabold">Your Documents</h2>
                <DocumentList selectedDocumentId={selectedDocumentId} onSelect={(document) => setSelectedDocumentId(document.id)} onDeleted={handleDeleted} refreshKey={refreshKey} />
              </div>
            </section>

            <McqSettings count={count} onCountChange={setCount} onGenerate={handleGenerate} disabled={generating || !selectedDocumentId} generating={generating} />
          </div>

          {error && <p className="mt-4 text-sm font-medium text-destructive">{error}</p>}
        </>
      )}
    </>
  );
}
