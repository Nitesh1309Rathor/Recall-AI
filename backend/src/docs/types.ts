import { Document } from "@langchain/core/documents";

export type ScrapeDocs = {
  url: string;
  text: string;
};

export type RetrievedChunk = {
  text: string;
  meta: {
    documentId: string;
    source: string;
    chunkId: number;
  };
};

export type KBSource = {
  documentId: string;
  source: string;
  chunkId: number;
};

export type KBResult = {
  answer: string;
  sources: KBSource[];
  confidence: number | null;
};

export type KBAddResult = {
  isDuplicate: boolean;
  document: {
    id: string;
    title: string;
    source: string | null;
    type: string;
    contentHash: string;
    chunkCount: number;
    createdAt: Date;
    updatedAt: Date;
  };
  chunks: Document[];
};
