import "dotenv/config";
import { z } from "zod";

const EnvSchema = z.object({
  PORT: z.string().default("5000"),
  ALLOWED_URL: z.string().default("http://localhost:3000"),
  GEMINI_API_KEY: z.string().optional(),
  GROQ_API_KEY: z.string().optional(),
  MODEL_PROVIDER: z.enum(["groq", "gemini"]).default("gemini"),
  GEMINI_MODEL: z.string().default("gemini-2.5-flash"),
  GROQ_MODEL: z.string().default("llama-3.1-8b-instant"),
  DATABASE_URL: z.string().default("postgresql://postgres:postgres@localhost:5432/recall_ai"),
});

export const env = EnvSchema.parse(process.env);
