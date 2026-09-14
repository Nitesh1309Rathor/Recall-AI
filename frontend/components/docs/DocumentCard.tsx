"use client";

import { FileText, MoreVertical } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Document } from "@/lib/types";

interface DocumentCardProps {
  document: Document;
  selected: boolean;
  onSelect: (document: Document) => void;
}

export function DocumentCard({ document, selected, onSelect }: DocumentCardProps) {
  return (
    <button
      type="button"
      className={cn(
        "flex min-h-[70px] w-full cursor-pointer items-center gap-4 rounded-lg border bg-card px-4 text-left transition",
        selected ? "border-primary bg-primary/5 shadow-sm" : "border-border hover:border-primary/50 hover:bg-muted/50",
      )}
      onClick={() => onSelect(document)}
    >
      <span
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
          selected ? "border-primary" : "border-muted-foreground",
        )}
      >
        {selected && <span className="h-2.5 w-2.5 rounded-full bg-primary" />}
      </span>

      <span className="flex h-9 w-8 shrink-0 items-center justify-center rounded bg-[#ef2f2f] text-white">
        <FileText className="h-5 w-5" />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate text-base font-extrabold">{document.title}</span>
        <span className="mt-1 block text-sm text-muted-foreground">{document.chunkCount} chunks</span>
      </span>

      <MoreVertical className="h-5 w-5 shrink-0 text-muted-foreground" />
    </button>
  );
}
