"use client";

import { useRef, useState } from "react";
import { UploadCloud } from "lucide-react";

import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import type { Document } from "@/lib/types";

interface UploadPdfProps {
  onUploaded: (document: Document) => void;
}

export function UploadPdf({ onUploaded }: UploadPdfProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    if (file.type !== "application/pdf") {
      setError("Please select a PDF file.");
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const result = await api.uploadPdf(file);

      onUploaded(result.document);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to upload PDF.");
    } finally {
      setUploading(false);
    }
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (file) {
      handleFile(file);
    }
  }

  return (
    <div>
      <input ref={inputRef} type="file" accept=".pdf,application/pdf" className="hidden" onChange={handleChange} />

      <div
        className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card px-6 py-6 text-center transition hover:border-primary hover:bg-muted/50 sm:flex-row sm:text-left"
        onClick={() => inputRef.current?.click()}
      >
        <div className="flex h-14 w-14 shrink-0 items-center justify-center text-primary">
          <UploadCloud className="h-12 w-12" strokeWidth={1.8} />
        </div>

        <div className="mt-3 sm:ml-6 sm:mt-0">
          <h3 className="text-lg font-extrabold">{uploading ? "Uploading New Document..." : "Upload New Document"}</h3>

          <p className="mt-2 text-sm text-muted-foreground">Drag & drop your PDF here, or</p>

          <Button
            type="button"
            variant="outline"
            className="mt-3 h-9 border-primary/50 px-5 text-sm font-bold text-primary hover:bg-primary/10"
            disabled={uploading}
            onClick={(event) => {
              event.stopPropagation();
              inputRef.current?.click();
            }}
          >
            {uploading ? "Processing..." : "Choose PDF"}
          </Button>
        </div>
      </div>

      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
    </div>
  );
}
