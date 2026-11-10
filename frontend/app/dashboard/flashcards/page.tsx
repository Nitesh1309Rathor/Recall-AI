"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, CalendarDays, ChevronRight, Eye, FileText, MoreVertical, Plus, RotateCcw, Search, Sparkles, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { api } from "@/lib/api";
import type { Document, FlashcardSet, FlashcardSetSummary } from "@/lib/types";

type View = "sets" | "generate" | "study" | "details";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
}

function validCount(value: string) {
  const count = Number(value);
  return /^[1-9]\d*$/.test(value) && Number.isInteger(count) && count >= 1 && count <= 50;
}

export default function FlashcardsPage() {
  const [view, setView] = useState<View>("sets");
  const [sets, setSets] = useState<FlashcardSetSummary[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedSet, setSelectedSet] = useState<FlashcardSet | null>(null);
  const [documentId, setDocumentId] = useState("");
  const [countInput, setCountInput] = useState("10");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [index, setIndex] = useState(0);
  const [answerVisible, setAnswerVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadSets() {
    try { setError(""); setSets(await api.getFlashcardSets()); }
    catch (requestError) { setError(requestError instanceof Error ? requestError.message : "Unable to load flashcard sets."); }
  }

  useEffect(() => { void loadSets(); }, []);

  async function openGenerate() {
    try {
      setError(""); setDocuments(await api.getDocuments()); setDocumentId(""); setCountInput("10"); setView("generate");
    } catch (requestError) { setError(requestError instanceof Error ? requestError.message : "Unable to load documents."); }
  }

  async function generate() {
    const count = Number(countInput);
    if (!documentId) return setError("Please select a document first.");
    if (!validCount(countInput)) return setError("Flashcard count must be a whole number between 1 and 50.");
    try {
      setLoading(true); setError("");
      const result = await api.generateFlashcards(documentId, count);
      setSelectedSet(result); setIndex(0); setAnswerVisible(false); await loadSets(); setView("study");
    } catch (requestError) { setError(requestError instanceof Error ? requestError.message : "Unable to generate flashcards."); }
    finally { setLoading(false); }
  }

  async function openSet(setId: string, nextView: View = "study") {
    try {
      setLoading(true); setError(""); setSelectedSet(await api.getFlashcardSet(setId)); setIndex(0); setAnswerVisible(false); setView(nextView);
    } catch (requestError) { setError(requestError instanceof Error ? requestError.message : "Unable to load flashcard set."); }
    finally { setLoading(false); }
  }

  async function deleteSet(setId: string) {
    if (!window.confirm("Delete this flashcard set and all of its cards?")) return;
    try { setLoading(true); await api.deleteFlashcardSet(setId); if (selectedSet?.id === setId) setSelectedSet(null); await loadSets(); setView("sets"); }
    catch (requestError) { setError(requestError instanceof Error ? requestError.message : "Unable to delete flashcard set."); }
    finally { setLoading(false); }
  }

  const filteredSets = useMemo(() => sets.filter((set) => `${set.title} ${set.document.title}`.toLowerCase().includes(search.toLowerCase())), [search, sets]);

  if (view === "generate") return <GenerateView documents={documents} documentId={documentId} countInput={countInput} loading={loading} error={error} onBack={() => setView("sets")} onDocumentChange={setDocumentId} onCountChange={setCountInput} onGenerate={generate} />;
  if ((view === "study" || view === "details") && selectedSet) return <SetView set={selectedSet} view={view} index={index} answerVisible={answerVisible} loading={loading} error={error} onBack={() => setView("sets")} onDetails={() => setView(view === "study" ? "details" : "study")} onDelete={() => deleteSet(selectedSet.id)} onIndexChange={(nextIndex) => { setIndex(nextIndex); setAnswerVisible(false); }} onToggleAnswer={() => setAnswerVisible((value) => !value)} />;

  return <div className="space-y-8">
    <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><PageHeader eyebrow="Study tool" title="Flashcards" subtitle="Create and study flashcards from your uploaded documents." /><Button onClick={openGenerate} className="h-11 px-5"><Plus className="size-4" />Generate Flashcards</Button></div>
    <label className="relative block max-w-xl"><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search flashcard sets..." className="h-11 w-full rounded-lg border border-border bg-card pl-10 pr-3 outline-none focus:border-primary" /></label>
    {error && <p role="alert" className="text-sm font-medium text-destructive">{error}</p>}
    {!filteredSets.length ? <EmptyState onGenerate={openGenerate} /> : <><div className="space-y-3">{filteredSets.slice((page - 1) * 6, page * 6).map((set) => <SetCard key={set.id} set={set} onOpen={() => openSet(set.id)} onDelete={() => deleteSet(set.id)} />)}</div><Pagination page={page} total={filteredSets.length} pageSize={6} onPageChange={setPage} /></>}
  </div>;
}

function PageHeader({ eyebrow, title, subtitle, onBack }: { eyebrow: string; title: string; subtitle: string; onBack?: () => void }) {
  return <header>{onBack && <button type="button" onClick={onBack} className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" />Back</button>}<p className="text-sm font-semibold text-primary">{eyebrow}</p><h1 className="mt-2 text-4xl font-bold tracking-tight">{title}</h1><p className="mt-3 text-muted-foreground">{subtitle}</p></header>;
}

function EmptyState({ onGenerate }: { onGenerate: () => void }) {
  return <div className="recall-panel flex min-h-[300px] flex-col items-center justify-center p-8 text-center"><FileText className="size-10 text-primary" /><h2 className="mt-4 text-xl font-bold">No flashcard sets yet</h2><p className="mt-2 text-muted-foreground">Generate flashcards from one of your uploaded documents to begin studying.</p><Button onClick={onGenerate} className="mt-6"><Plus className="size-4" />Generate Flashcards</Button></div>;
}

function SetCard({ set, onOpen, onDelete }: { set: FlashcardSetSummary; onOpen: () => void; onDelete: () => void }) {
  return <article className="recall-panel flex items-center gap-4 p-5"><button type="button" onClick={onOpen} className="flex min-w-0 flex-1 items-center gap-4 text-left"><span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"><FileText className="size-5" /></span><span className="min-w-0"><strong className="block truncate text-base font-bold">{set.title}</strong><span className="mt-1 block truncate text-sm text-muted-foreground">From: {set.document.title}</span></span></button><span className="hidden rounded-full border border-border px-3 py-1 text-xs font-semibold sm:inline-flex">{set._count.cards} cards</span><span className="hidden items-center gap-2 text-sm text-muted-foreground md:flex"><CalendarDays className="size-4" />{formatDate(set.createdAt)}</span><DropdownMenu><DropdownMenuTrigger render={<button type="button" aria-label={`Actions for ${set.title}`} className="rounded-lg p-2 text-muted-foreground hover:bg-muted"><MoreVertical className="size-5" /></button>} /><DropdownMenuContent><DropdownMenuItem onClick={onOpen}>Open set</DropdownMenuItem><DropdownMenuItem onClick={onDelete} className="text-destructive"><Trash2 className="size-4" />Delete set</DropdownMenuItem></DropdownMenuContent></DropdownMenu></article>;
}

function Pagination({ page, total, pageSize, onPageChange }: { page: number; total: number; pageSize: number; onPageChange: (page: number) => void }) {
  const pageCount = Math.ceil(total / pageSize);
  return <div className="flex items-center justify-between border-t border-border pt-4 text-sm"><span className="text-muted-foreground">Page {page} of {pageCount}</span><div className="flex items-center gap-2"><button type="button" onClick={() => onPageChange(page - 1)} disabled={page === 1} className="rounded-lg border border-border px-3 py-2 font-semibold hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40">Previous</button><button type="button" onClick={() => onPageChange(page + 1)} disabled={page === pageCount} className="rounded-lg border border-border px-3 py-2 font-semibold hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40">Next</button></div></div>;
}

function GenerateView({ documents, documentId, countInput, loading, error, onBack, onDocumentChange, onCountChange, onGenerate }: { documents: Document[]; documentId: string; countInput: string; loading: boolean; error: string; onBack: () => void; onDocumentChange: (value: string) => void; onCountChange: (value: string) => void; onGenerate: () => void }) {
  return <div className="w-full max-w-none space-y-6"><PageHeader eyebrow="Flashcards" title="Generate Flashcards" subtitle="Select a document and generate flashcards using AI." onBack={onBack} /><section className="recall-panel w-full p-5 md:p-7"><label className="block text-sm font-semibold">Select document<select value={documentId} onChange={(event) => onDocumentChange(event.target.value)} disabled={loading} className="mt-2 h-12 w-full rounded-lg border border-border bg-card px-3 font-normal"><option value="">Choose a document</option>{documents.map((document) => <option key={document.id} value={document.id}>{document.title}</option>)}</select></label><div className="mt-6 border-t border-border pt-5"><p className="text-sm font-semibold">Number of flashcards</p><div className="mt-3 flex items-center gap-3"><CountButton disabled={loading || countInput === "1"} onClick={() => onCountChange(String(Math.max(1, Number(countInput || 1) - 1)))}>-</CountButton><input type="number" min={1} max={50} step={1} value={countInput} onChange={(event) => onCountChange(event.target.value)} disabled={loading} aria-label="Number of flashcards" className="h-11 w-20 rounded-lg border border-border bg-card text-center font-semibold outline-none focus:border-primary" /><CountButton disabled={loading || countInput === "50"} onClick={() => onCountChange(String(Math.min(50, Number(countInput || 1) + 1)))}>+</CountButton><span className="text-sm text-muted-foreground">(1–50)</span></div></div>{error && <p role="alert" className="mt-5 text-sm font-medium text-destructive">{error}</p>}<div className="mt-7 flex justify-end"><Button onClick={onGenerate} disabled={loading || !documentId} className="h-11 px-5"><Sparkles className="size-4" />{loading ? "Generating..." : "Generate Flashcards"}</Button></div></section>{loading && <div className="recall-panel flex min-h-[220px] flex-col items-center justify-center p-8 text-center"><RotateCcw className="size-9 animate-spin text-primary" /><h2 className="mt-5 text-xl font-bold">Generating your flashcards...</h2><p className="mt-2 text-sm text-muted-foreground">This may take a few seconds while we process your document using AI.</p></div>}</div>;
}

function CountButton({ disabled, onClick, children }: { disabled: boolean; onClick: () => void; children: React.ReactNode }) { return <button type="button" aria-label={children === "+" ? "Increase flashcard count" : "Decrease flashcard count"} disabled={disabled} onClick={onClick} className="flex size-11 items-center justify-center rounded-lg border border-border bg-card text-xl font-semibold text-primary transition hover:bg-muted disabled:opacity-40">{children}</button>; }

function SetView({ set, view, index, answerVisible, loading, error, onBack, onDetails, onDelete, onIndexChange, onToggleAnswer }: { set: FlashcardSet; view: "study" | "details"; index: number; answerVisible: boolean; loading: boolean; error: string; onBack: () => void; onDetails: () => void; onDelete: () => void; onIndexChange: (index: number) => void; onToggleAnswer: () => void }) {
  if (view === "details") return <div className="space-y-8"><div className="flex items-start justify-between gap-4"><PageHeader eyebrow="Flashcards" title={set.title} subtitle="Review every question and answer in this set." onBack={onBack} /><DropdownMenu><DropdownMenuTrigger render={<button type="button" aria-label="Set actions" className="rounded-lg border border-border p-2 hover:bg-muted"><MoreVertical className="size-5" /></button>} /><DropdownMenuContent><DropdownMenuItem onClick={onDelete} className="text-destructive"><Trash2 className="size-4" />Delete set</DropdownMenuItem></DropdownMenuContent></DropdownMenu></div><div className="grid gap-3 sm:grid-cols-3"><InfoCard label="From" value={set.document.title} /><InfoCard label="Created on" value={formatDate(set.createdAt)} /><InfoCard label="Total cards" value={String(set.cards.length)} /></div><div className="space-y-2"><h2 className="text-xl font-bold">All flashcards</h2>{set.cards.map((card) => <button key={card.id} type="button" onClick={() => { onIndexChange(card.order); onDetails(); }} className="flex w-full items-center justify-between rounded-lg border border-border bg-card px-5 py-4 text-left hover:border-primary"><span className="font-semibold">{card.front}</span><ChevronRight className="size-4 text-muted-foreground" /></button>)}</div>{error && <p role="alert" className="text-sm text-destructive">{error}</p>}</div>;
  const card = set.cards[index];
  const progress = set.cards.length ? ((index + 1) / set.cards.length) * 100 : 0;
  return <div className="mx-auto max-w-4xl space-y-7"><div className="flex items-center justify-between gap-3"><button type="button" onClick={onBack} className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" />Back</button><h1 className="text-xl font-bold">{set.title}</h1><button type="button" onClick={onDetails} className="text-sm font-semibold text-primary">Details</button></div><div className="flex items-center justify-between text-sm font-semibold text-muted-foreground"><span>Card {index + 1} of {set.cards.length}</span><span>{Math.round(progress)}%</span></div><div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary transition-[width]" style={{ width: `${progress}%` }} /></div><div className="flashcard-scene"><section className={`recall-panel flashcard-inner ${answerVisible ? "is-flipped" : ""}`}><div className="flashcard-face flashcard-front p-8 md:p-12"><div className="flex min-h-[300px] flex-col items-center justify-center text-center"><span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">Question</span><p className="mt-7 max-w-3xl text-2xl font-bold leading-tight md:text-3xl">{card.front}</p><button type="button" onClick={onToggleAnswer} className="mt-12 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"><Eye className="size-4" />Show Answer</button></div></div><div className="flashcard-face flashcard-back p-8 md:p-12"><div className="flex min-h-[300px] flex-col items-center justify-center text-center"><span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">Answer</span><p className="mt-7 max-w-3xl text-2xl font-bold leading-tight md:text-3xl">{card.back}</p><button type="button" onClick={onToggleAnswer} className="mt-12 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"><Eye className="size-4" />Show Question</button></div></div></section></div><div className="flex items-center justify-between"><Button variant="outline" onClick={() => onIndexChange(index - 1)} disabled={loading || index === 0}><ArrowLeft className="size-4" />Previous</Button><Button onClick={() => onIndexChange(index + 1)} disabled={loading || index === set.cards.length - 1}>Next<ArrowRight className="size-4" /></Button></div></div>;
}

function InfoCard({ label, value }: { label: string; value: string }) { return <div className="rounded-lg border border-border bg-card p-4"><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p><p className="mt-2 truncate font-bold">{value}</p></div>; }
