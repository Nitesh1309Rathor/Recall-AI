"use client";

import { useState } from "react";

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
