import type { Document, FlashcardSet, FlashcardSetSummary, MCQProgress, MCQResponse, MCQTest, MCQTestSummary, UploadDocumentResponse } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let message = "Something went wrong";

    try {
      const data = await response.json();

      if (data?.message) {
        message = data.message;
      } else if (data?.error) {
        message = data.error;
      }
    } catch {
      // Response wasn't JSON
    }

    throw new Error(message);
  }

  return response.json();
}

export const api = {
  async getDocuments(): Promise<Document[]> {
    const response = await fetch(`${API_URL}/api/documents`, {
      method: "GET",
      credentials: "include",
    });

    return handleResponse<Document[]>(response);
  },

  async uploadPdf(file: File): Promise<UploadDocumentResponse> {
    const formData = new FormData();

    formData.append("file", file);

    const response = await fetch(`${API_URL}/api/ingest/pdf`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    return handleResponse<UploadDocumentResponse>(response);
  },

  async ingestUrl(url: string): Promise<UploadDocumentResponse> {
    const response = await fetch(`${API_URL}/api/ingest/url`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url,
      }),
    });

    return handleResponse<UploadDocumentResponse>(response);
  },

  async deleteDocument(documentId: string): Promise<{
    message: string;
  }> {
    const response = await fetch(`${API_URL}/api/documents/${documentId}`, {
      method: "DELETE",
      credentials: "include",
    });

    return handleResponse<{
      message: string;
    }>(response);
  },

  async generateMCQs(documentId: string, count: number, difficulty: "Easy" | "Medium" | "Hard" = "Medium"): Promise<MCQResponse> {
    const response = await fetch(`${API_URL}/api/ask/mcqs`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        documentId,
        count,
        difficulty,
      }),
    });

    return handleResponse<MCQResponse>(response);
  },

  async generateMCQTest(documentId: string, count: number, difficulty: "Easy" | "Medium" | "Hard"): Promise<MCQTest> {
    const response = await fetch(`${API_URL}/api/mcqs/tests/generate`, { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ documentId, count, difficulty }) });
    return handleResponse<MCQTest>(response);
  },

  async submitMCQTest(testId: string, answers: Array<{ questionId: string; selectedAnswer: string | null }>): Promise<MCQTest> {
    const response = await fetch(`${API_URL}/api/mcqs/tests/${testId}/submit`, { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ answers }) });
    return handleResponse<MCQTest>(response);
  },

  async getMCQTests(): Promise<MCQTestSummary[]> {
    const response = await fetch(`${API_URL}/api/mcqs/tests`, { method: "GET", credentials: "include" });
    return handleResponse<MCQTestSummary[]>(response);
  },

  async getMCQTest(testId: string): Promise<MCQTest> {
    const response = await fetch(`${API_URL}/api/mcqs/tests/${testId}`, { method: "GET", credentials: "include" });
    return handleResponse<MCQTest>(response);
  },

  async deleteMCQTest(testId: string): Promise<{ message: string }> {
    const response = await fetch(`${API_URL}/api/mcqs/tests/${testId}`, { method: "DELETE", credentials: "include" });
    return handleResponse<{ message: string }>(response);
  },

  async getMCQProgress(): Promise<MCQProgress> {
    const response = await fetch(`${API_URL}/api/mcqs/progress`, { method: "GET", credentials: "include" });
    return handleResponse<MCQProgress>(response);
  },

  async getFlashcardSets(): Promise<FlashcardSetSummary[]> {
    const response = await fetch(`${API_URL}/api/flashcards`, { method: "GET", credentials: "include" });
    return handleResponse<FlashcardSetSummary[]>(response);
  },

  async getFlashcardSet(setId: string): Promise<FlashcardSet> {
    const response = await fetch(`${API_URL}/api/flashcards/${setId}`, { method: "GET", credentials: "include" });
    return handleResponse<FlashcardSet>(response);
  },

  async generateFlashcards(documentId: string, requestedCount: number): Promise<FlashcardSet> {
    const response = await fetch(`${API_URL}/api/flashcards/generate`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ documentId, requestedCount }),
    });
    return handleResponse<FlashcardSet>(response);
  },

  async deleteFlashcardSet(setId: string): Promise<{ message: string }> {
    const response = await fetch(`${API_URL}/api/flashcards/${setId}`, { method: "DELETE", credentials: "include" });
    return handleResponse<{ message: string }>(response);
  },

  async login(email: string, password: string) {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    return handleResponse<{
      message: string;
      user: {
        id: string;
        email: string;
      };
    }>(response);
  },

  async signup(email: string, password: string) {
    const response = await fetch(`${API_URL}/api/auth/signup`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    return handleResponse<{
      message: string;
      user: {
        id: string;
        email: string;
      };
    }>(response);
  },

  async me(): Promise<{
    user: {
      id: string;
      email: string;
    };
  }> {
    const response = await fetch(`${API_URL}/api/auth/me`, {
      method: "GET",
      credentials: "include",
    });

    return handleResponse<{
      user: {
        id: string;
        email: string;
      };
    }>(response);
  },

  async logout(): Promise<{
    message: string;
  }> {
    const response = await fetch(`${API_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    return handleResponse<{
      message: string;
    }>(response);
  },
};
