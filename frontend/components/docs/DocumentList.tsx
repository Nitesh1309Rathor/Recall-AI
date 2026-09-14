"use client";

import { useEffect, useState } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import type { Document } from "@/lib/types";

import { DocumentCard } from "./DocumentCard";

interface DocumentListProps {
  selectedDocumentId: string | null;
  onSelect: (document: Document) => void;
  refreshKey: number;
}

export function DocumentList({ selectedDocumentId, onSelect, refreshKey }: DocumentListProps) {
  const [documents, setDocuments] = useState<Document[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDocuments() {
      try {
        setLoading(true);
        setError(null);

        const data = await api.getDocuments();

        setDocuments(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Failed to load documents.");
      } finally {
        setLoading(false);
      }
    }

    loadDocuments();
  }, [refreshKey]);

  if (loading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-[70px] w-full rounded-lg" />
        <Skeleton className="h-[70px] w-full rounded-lg" />
        <Skeleton className="h-[70px] w-full rounded-lg" />
      </div>
    );
  }

  if (error) {
    return <p className="text-sm text-destructive">{error}</p>;
  }

  if (documents.length === 0) {
    return <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">No documents yet. Upload your first PDF.</p>;
  }

  return (
    <div className="space-y-2">
      {documents.map((document) => (
        <DocumentCard key={document.id} document={document} selected={document.id === selectedDocumentId} onSelect={onSelect} />
      ))}
      <p className="pt-3 text-center text-sm text-muted-foreground">No more documents.</p>
    </div>
  );
}
