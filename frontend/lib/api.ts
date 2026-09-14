import type { Document, MCQResponse, UploadDocumentResponse } from "./types";

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
    });

    return handleResponse<Document[]>(response);
  },

  async uploadPdf(file: File): Promise<UploadDocumentResponse> {
    const formData = new FormData();

    formData.append("file", file);

    const response = await fetch(`${API_URL}/api/ingest/pdf`, {
      method: "POST",
      body: formData,
    });

    return handleResponse<UploadDocumentResponse>(response);
  },

  async generateMCQs(documentId: string, count: number): Promise<MCQResponse> {
    const response = await fetch(`${API_URL}/api/ask/mcqs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        documentId,
        count,
      }),
    });

    return handleResponse<MCQResponse>(response);
  },
};
