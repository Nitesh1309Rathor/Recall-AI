"use client";

import { useEffect, useState } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import type { Document } from "@/lib/types";

import { DocumentCard } from "./DocumentCard";

interface DocumentListProps {
  selectedDocumentId: string | null;
  onSelect: (document: Document) => void;
  onDeleted?: (document: Document) => void;
  refreshKey: number;
}

export function DocumentList({ selectedDocumentId, onSelect, onDeleted, refreshKey }: DocumentListProps) {
  const [documents, setDocuments] = useState<Document[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  async function handleDelete(document: Document) {
    try {
      setError(null);

      await api.deleteDocument(document.id);

      setDocuments((current) => current.filter((item) => item.id !== document.id));
      onDeleted?.(document);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to delete document.");
    }
  }

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
    return <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">No documents yet. Add your first PDF or web URL.</p>;
  }

  return (
    <div className="space-y-2">
      {documents.map((document) => (
        <DocumentCard key={document.id} document={document} selected={document.id === selectedDocumentId} onSelect={onSelect} onDelete={handleDelete} />
      ))}
      <p className="pt-3 text-center text-sm text-muted-foreground">No more documents.</p>
    </div>
  );
}
