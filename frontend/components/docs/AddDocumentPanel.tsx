"use client";

import { FormEvent, useState } from "react";
import { FileText, Info, LinkIcon } from "lucide-react";

import { UploadPdf } from "@/components/docs/UploadPdf";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { Document } from "@/lib/types";

type SourceType = "PDF" | "URL";

type AddDocumentPanelProps = {
  onAdded: (document: Document) => void;
};

const sources: Array<{
  type: SourceType;
  title: string;
  description: string;
  icon: typeof FileText;
}> = [
  {
    type: "PDF",
    title: "PDF Document",
    description: "Upload a PDF file from your device.",
    icon: FileText,
  },
  {
    type: "URL",
    title: "Web URL",
    description: "Add a link to an article or documentation.",
    icon: LinkIcon,
  },
];

export function AddDocumentPanel({ onAdded }: AddDocumentPanelProps) {
  const [sourceType, setSourceType] = useState<SourceType>("PDF");
  const [url, setUrl] = useState("");
  const [addingUrl, setAddingUrl] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUrlSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setError(null);
      setAddingUrl(true);

      const result = await api.ingestUrl(url);

      onAdded(result.document);
      setUrl("");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to add URL.");
    } finally {
      setAddingUrl(false);
    }
  }

  return (
    <div>
      <h2 className="text-lg font-extrabold">Add a New Document</h2>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {sources.map((source) => {
          const Icon = source.icon;
          const selected = source.type === sourceType;

          return (
            <button
              key={source.type}
              type="button"
              className={cn(
                "flex min-h-24 items-center gap-4 rounded-lg border bg-card px-5 py-4 text-left transition hover:border-primary/50 hover:bg-muted/40",
                selected && "border-primary bg-primary/5 shadow-sm",
              )}
              onClick={() => {
                setSourceType(source.type);
                setError(null);
              }}
            >
              <span
                className={cn(
                  "flex size-5 shrink-0 items-center justify-center rounded-full border-2",
                  selected ? "border-primary" : "border-muted-foreground",
                )}
              >
                {selected && <span className="size-2.5 rounded-full bg-primary" />}
              </span>

              <span
                className={cn(
                  "flex size-11 shrink-0 items-center justify-center rounded-lg text-white",
                  source.type === "PDF" ? "bg-rose-500" : "bg-indigo-500",
                )}
              >
                <Icon className="size-5" />
              </span>

              <span>
                <span className="block text-sm font-extrabold">{source.title}</span>
                <span className="mt-1 block text-sm leading-5 text-muted-foreground">{source.description}</span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-5">
        {sourceType === "PDF" ? (
          <UploadPdf onUploaded={onAdded} showTitle={false} />
        ) : (
          <form onSubmit={handleUrlSubmit} className="rounded-lg border border-dashed border-border bg-card p-5">
            <label htmlFor="web-url" className="text-sm font-extrabold">
              Enter Web URL
            </label>

            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              <div className="relative min-w-0 flex-1">
                <LinkIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="web-url"
                  type="text"
                  value={url}
                  onChange={(event) => setUrl(event.target.value)}
                  placeholder="https://example.com/article"
                  className="h-11 pl-10"
                  disabled={addingUrl}
                  required
                />
              </div>
              <Button type="submit" className="h-11 px-6" disabled={addingUrl || !url.trim()}>
                {addingUrl ? "Adding..." : "Add URL"}
              </Button>
            </div>

            <p className="mt-3 text-sm text-muted-foreground">Add a link to an article or documentation. We&apos;ll extract the content automatically.</p>

            <div className="mt-4 rounded-lg border border-border bg-muted/40 p-4">
              <div className="flex gap-3">
                <Info className="mt-0.5 size-4 shrink-0 text-primary" />
                <div>
                  <p className="text-sm font-bold text-primary">Supported content</p>
                  <p className="mt-1 text-sm text-muted-foreground">Works best with educational articles, documentation, and technical blogs.</p>
                </div>
              </div>
            </div>
          </form>
        )}

        {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
      </div>
    </div>
  );
}
