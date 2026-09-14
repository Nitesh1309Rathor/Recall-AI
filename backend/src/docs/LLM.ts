import { BaseChatModel } from "@langchain/core/language_models/chat_models";

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatGroq } from "@langchain/groq";
import { env } from "../config/env";

type modelOptions = { temperature?: number; maxTokens?: number };

export function getChatModel(options: modelOptions): BaseChatModel {
  switch (env.MODEL_PROVIDER) {
    case "gemini":
      return new ChatGoogleGenerativeAI({
        apiKey: env.GEMINI_API_KEY,
        model: env.GEMINI_MODEL,
        temperature: options.temperature,
      });

    case "groq":
      return new ChatGroq({
        apiKey: env.GROQ_API_KEY,
        model: env.GROQ_MODEL,
        temperature: options.temperature,
      });

    default:
      return new ChatGoogleGenerativeAI({
        apiKey: env.GEMINI_API_KEY,
        model: env.GEMINI_MODEL,
        temperature: options.temperature,
      });
  }
}
