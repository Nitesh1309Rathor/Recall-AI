"use client";

import { ExternalLink, FileText, LinkIcon, MoreVertical, Trash2 } from "lucide-react";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { Document } from "@/lib/types";

interface DocumentCardProps {
  document: Document;
  selected: boolean;
  onSelect: (document: Document) => void;
  onDelete?: (document: Document) => void;
}

function formatRelativeDate(value: string) {
  const date = new Date(value);
  const diffMs = Date.now() - date.getTime();
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (Number.isNaN(date.getTime())) return "";
  if (diffMs < minute) return "just now";
  if (diffMs < hour) {
    const minutes = Math.max(1, Math.floor(diffMs / minute));
    return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  }
  if (diffMs < day) {
    const hours = Math.floor(diffMs / hour);
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }

  const days = Math.floor(diffMs / day);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

export function DocumentCard({ document, selected, onSelect, onDelete }: DocumentCardProps) {
  const isUrl = document.type === "URL";
  const Icon = isUrl ? LinkIcon : FileText;
  const relativeDate = formatRelativeDate(document.createdAt);
  const meta = `${document.chunkCount} chunks • ${document.type}${relativeDate ? ` • ${relativeDate}` : ""}`;

  return (
    <div
      className={cn(
        "flex min-h-[70px] w-full items-center gap-4 rounded-lg border bg-card px-4 transition",
        selected ? "border-primary bg-primary/5 shadow-sm" : "border-border hover:border-primary/50 hover:bg-muted/50",
      )}
    >
      <button
        type="button"
        className="flex min-w-0 flex-1 items-center gap-4 py-3 text-left"
        onClick={() => onSelect(document)}
      >
        <span
          className={cn(
            "flex size-5 shrink-0 items-center justify-center rounded-full border-2",
            selected ? "border-primary" : "border-muted-foreground",
          )}
        >
          {selected && <span className="size-2.5 rounded-full bg-primary" />}
        </span>

        <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-lg text-white", isUrl ? "bg-indigo-500" : "bg-rose-500")}>
          <Icon className="size-5" />
        </span>

        <span className="min-w-0 flex-1">
          <span className="block truncate text-base font-extrabold">{document.title}</span>
          <span className="mt-1 block text-sm text-muted-foreground">{meta}</span>
        </span>
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger
          className="flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground outline-none transition hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
          aria-label={`Open actions for ${document.title}`}
          onClick={(event) => event.stopPropagation()}
        >
          <MoreVertical className="size-5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            disabled={!document.source}
            onClick={() => {
              if (document.source) {
                window.open(document.source, "_blank", "noopener,noreferrer");
              }
            }}
          >
            <ExternalLink className="size-4" />
            View Source
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onDelete?.(document)} className="text-destructive data-[highlighted]:text-destructive">
            <Trash2 className="size-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
