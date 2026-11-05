"use client";

import { useState } from "react";

import { AddDocumentPanel } from "@/components/docs/AddDocumentPanel";
import { DocumentList } from "@/components/docs/DocumentList";
import type { Document } from "@/lib/types";

export default function DocumentsPage() {
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  function handleUploaded(document: Document) {
    setSelectedDocumentId(document.id);
    setRefreshKey((value) => value + 1);
  }

  function handleDeleted(document: Document) {
    if (document.id === selectedDocumentId) {
      setSelectedDocumentId(null);
    }
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Documents</h1>
        <p className="mt-3 text-base text-muted-foreground">Upload PDFs and manage the study materials Recall AI can use for quizzes.</p>
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-lg border border-border bg-card p-6 shadow-sm md:p-7">
          <AddDocumentPanel onAdded={handleUploaded} />
        </section>

        <section className="rounded-lg border border-border bg-card p-6 shadow-sm md:p-7">
          <h2 className="mb-4 text-sm font-extrabold">Your Documents</h2>
          <DocumentList selectedDocumentId={selectedDocumentId} onSelect={(document) => setSelectedDocumentId(document.id)} onDeleted={handleDeleted} refreshKey={refreshKey} />
        </section>
      </div>
    </>
  );
}
