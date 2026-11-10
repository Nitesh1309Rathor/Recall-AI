import { getChatModel } from "../../docs/LLM";
import { FlashcardResponse, FlashcardResponseSchema } from "../../lib/flashcard.schema";
import { ChunkData, createBatches, createContext, distributeQuestions, getTotalCharacters, MAX_SINGLE_CALL_CHARS } from "../mcqs/mcqGeneration.service";

const EXTRA_CARD_RATIO = 1.2;

function getStructuredLLM() {
  return getChatModel({ temperature: 0.8 }).withStructuredOutput<FlashcardResponse>(FlashcardResponseSchema);
}

function createFlashcardPrompt(context: string, count: number, variationKey: string) {
  return `
You are an educational flashcard generator.

Generate exactly ${count} flashcards using ONLY the supplied document content.
Each flashcard must contain a clear question in "front" and a concise,
accurate answer in "back".

Generation variation key: ${variationKey}
Create a fresh set by selecting different important concepts, facts,
definitions, and relationships where the document allows it.

Rules:
1. Do not use external knowledge.
2. Do not invent information.
3. Every front must be answerable from the document.
4. Avoid vague, duplicate, or nearly identical questions.
5. Focus on important concepts, definitions, facts, and relationships.

DOCUMENT CONTENT:
${context}
`;
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function removeDuplicates(flashcards: FlashcardResponse["flashcards"]) {
  const seen = new Set<string>();
  return flashcards.filter((card) => {
    const key = normalize(card.front);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function generateFromBatches(batches: ChunkData[][], count: number, variationKey: string) {
  const llm = getStructuredLLM();
  const generationCount = Math.max(Math.ceil(count * EXTRA_CARD_RATIO), batches.length);
  const counts = distributeQuestions(generationCount, batches.length);
  const cards: FlashcardResponse["flashcards"] = [];

  for (let index = 0; index < batches.length; index++) {
    const result = await llm.invoke(createFlashcardPrompt(createContext(batches[index]), counts[index], `${variationKey}-batch-${index + 1}`));
    cards.push(...result.flashcards);
  }

  return cards;
}

export async function generateFlashcardsFromChunks(chunks: ChunkData[], requestedCount: number) {
  const variationKey = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  const generationCount = Math.ceil(requestedCount * EXTRA_CARD_RATIO);
  const candidates =
    getTotalCharacters(chunks) <= MAX_SINGLE_CALL_CHARS
      ? (await getStructuredLLM().invoke(createFlashcardPrompt(createContext(chunks), generationCount, variationKey))).flashcards
      : await generateFromBatches(createBatches(chunks), requestedCount, variationKey);
  const uniqueCards = removeDuplicates(candidates).slice(0, requestedCount);

  if (uniqueCards.length < requestedCount) {
    throw new Error("The document does not contain enough unique content for the requested flashcards");
  }

  return uniqueCards;
}
