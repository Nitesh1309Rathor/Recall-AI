export type DocumentType = "PDF" | "URL" | "TEXT";

export interface Document {
  id: string;
  title: string;
  source?: string | null;
  type: DocumentType;
  chunkCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface UploadDocumentResponse {
  isDuplicate: boolean;
  document: Document;
  chunks: unknown[];
}

export interface MCQ {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface MCQResponse {
  documentId: string;
  count: number;
  questions: MCQ[];
}
