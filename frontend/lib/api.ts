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

  async generateMCQs(documentId: string, count: number): Promise<MCQResponse> {
    const response = await fetch(`${API_URL}/api/ask/mcqs`, {
      method: "POST",
      credentials: "include",
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
};
