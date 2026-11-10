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

export interface MCQTestQuestion extends MCQ {
  id: string;
  order: number;
  selectedAnswer?: string | null;
  isCorrect?: boolean | null;
}

export interface MCQTest {
  id: string;
  userId: string;
  documentId: string;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  unansweredQuestions: number;
  status: "IN_PROGRESS" | "COMPLETED";
  score: number;
  createdAt: string;
  completedAt?: string | null;
  document: { title: string };
  questions: MCQTestQuestion[];
}

export interface MCQTestSummary {
  id: string;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  unansweredQuestions: number;
  score: number;
  status: "IN_PROGRESS" | "COMPLETED";
  createdAt: string;
  completedAt?: string | null;
  document: { title: string };
}

export interface MCQProgress {
  totalCompletedTests: number;
  totalQuestionsAttempted: number;
  totalCorrectAnswers: number;
  totalWrongAnswers: number;
  overallAccuracy: number;
  recentTests: Array<{ id: string; score: number; totalQuestions: number; correctAnswers: number; completedAt?: string | null; document: { title: string } }>;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  order: number;
  setId: string;
  createdAt: string;
}

export interface FlashcardSetSummary {
  id: string;
  title: string;
  documentId: string;
  createdAt: string;
  _count: { cards: number };
  document: { title: string };
}

export interface FlashcardSet extends Omit<FlashcardSetSummary, "_count"> {
  userId: string;
  updatedAt: string;
  cards: Flashcard[];
}
