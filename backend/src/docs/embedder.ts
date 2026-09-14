import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { env } from "../config/env";

let embeddings: GoogleGenerativeAIEmbeddings | null = null;

export function getEmbeddings() {
  if (embeddings) return embeddings;

  if (!env.GEMINI_API_KEY) {
    throw new Error("Missing GEMINI_API_KEY");
  }

  embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: env.GEMINI_API_KEY,
    model: "gemini-embedding-001",
  });

  return embeddings;
}
