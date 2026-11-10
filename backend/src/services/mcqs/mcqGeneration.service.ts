import { getChatModel } from "../../docs/LLM";
import { MCQResponse, MCQSchema } from "../../lib/schema";

type Difficulty = "Easy" | "Medium" | "Hard";

export type ChunkData = {
  chunkIndex: number;
  content: string;
};

export const MAX_SINGLE_CALL_CHARS = 30_000;
export const MAX_BATCH_CHARS = 12_000;
export const EXTRA_QUESTION_RATIO = 1.2;

/**
 * Create batches based on character size.
 */
export function createBatches(chunks: ChunkData[]): ChunkData[][] {
  const batches: ChunkData[][] = [];

  let currentBatch: ChunkData[] = [];
  let currentLength = 0;

  for (const chunk of chunks) {
    const chunkLength = chunk.content.length;

    if (currentBatch.length > 0 && currentLength + chunkLength > MAX_BATCH_CHARS) {
      batches.push(currentBatch);

      currentBatch = [];
      currentLength = 0;
    }

    currentBatch.push(chunk);
    currentLength += chunkLength;
  }

  if (currentBatch.length > 0) {
    batches.push(currentBatch);
  }

  return batches;
}

/**
 * Calculate total characters of all chunks.
 */
export function getTotalCharacters(chunks: ChunkData[]): number {
  return chunks.reduce((total, chunk) => total + chunk.content.length, 0);
}

/**
 * Distribute questions across batches.
 *
 * Example:
 * target = 12
 * batches = 3
 *
 * [4, 4, 4]
 */
export function distributeQuestions(target: number, batchCount: number): number[] {
  const result = new Array(batchCount).fill(1);

  let remaining = target - batchCount;

  if (remaining <= 0) {
    return result;
  }

  let index = 0;

  while (remaining > 0) {
    result[index % batchCount]++;
    remaining--;
    index++;
  }

  return result;
}

/**
 * Create the document context sent to the LLM.
 */
export function createContext(chunks: ChunkData[]): string {
  return chunks.map((chunk) => `[Chunk ${chunk.chunkIndex}]\n${chunk.content}`).join("\n\n");
}

/**
 * Create the MCQ prompt.
 */
export function createMCQPrompt(
  context: string,
  questionCount: number,
  difficulty: Difficulty,
  variationKey: string,
): string {
  return `
You are an educational MCQ generator.

Generate exactly ${questionCount} high-quality
multiple-choice questions from ONLY the provided
document content.

Difficulty level: ${difficulty}

Generation variation key: ${variationKey}

This is a fresh generation request. Create a meaningfully different set
of questions from previous requests by selecting different concepts,
facts, relationships, and wording where the document allows it. Do not
repeat the most obvious questions from a previous generation.

Difficulty guidance:
- Easy: test basic recall, definitions, and directly stated facts.
- Medium: test understanding, comparisons, relationships, and simple application.
- Hard: test deeper reasoning, multi-step application, and subtle distinctions.

Rules:

1. Use ONLY the provided document content.
2. Do not use outside knowledge.
3. Every question must be answerable from the content.
4. Each question must have exactly 4 options.
5. Only one option must be correct.
6. correctAnswer must exactly match one of the options.
7. Include a concise explanation.
8. Avoid duplicate or nearly identical questions.
9. Focus on important concepts, facts, definitions,
   relationships, and understanding.
10. Do not mention chunks in the questions.
11. Do not invent information that is not present
    in the document.

DOCUMENT CONTENT:

${context}
`;
}

/**
 * Get structured LLM.
 */
function getStructuredLLM() {
  const llm = getChatModel({
    // Higher temperature helps repeated generations explore different valid
    // questions while the prompt still constrains them to the source content.
    temperature: 0.8,
  });

  return llm.withStructuredOutput<MCQResponse>(MCQSchema);
}

/**
 * Generate MCQs using ONE LLM call.
 */
export async function generateSingleCall(
  chunks: ChunkData[],
  requestedCount: number,
  difficulty: Difficulty,
  variationKey: string,
): Promise<MCQResponse> {
  const context = createContext(chunks);

  const structuredLLM = getStructuredLLM();

  const prompt = createMCQPrompt(context, requestedCount, difficulty, variationKey);

  console.log(`Generating ${requestedCount} MCQs using ONE LLM call`);

  return structuredLLM.invoke(prompt);
}

/**
 * Generate MCQs batch-wise.
 */
export async function generateBatchMCQs(
  batches: ChunkData[][],
  requestedCount: number,
  difficulty: Difficulty,
  variationKey: string,
): Promise<MCQResponse> {
  const targetCandidates = Math.ceil(requestedCount * EXTRA_QUESTION_RATIO);

  /*
   * Every batch must participate.
   */
  const generationCount = Math.max(targetCandidates, batches.length);

  const questionsPerBatch = distributeQuestions(generationCount, batches.length);

  console.log(`Target candidates: ${generationCount}`);

  const structuredLLM = getStructuredLLM();

  const candidates: MCQResponse["questions"] = [];

  /*
   * Sequential calls are intentional.
   *
   * We don't fire all free-tier API requests
   * simultaneously.
   */
  for (let i = 0; i < batches.length; i++) {
    const questionCount = questionsPerBatch[i];

    const context = createContext(batches[i]);

    const prompt = createMCQPrompt(context, questionCount, difficulty, `${variationKey}-batch-${i + 1}`);

    console.log(`Batch ${i + 1}/${batches.length} → ${questionCount} MCQs`);

    const result = await structuredLLM.invoke(prompt);

    candidates.push(...result.questions);
  }

  console.log(`Generated ${candidates.length} candidates`);

  return {
    questions: candidates,
  };
}

/**
 * Normalize question text.
 */
function normalizeQuestion(question: string): string {
  return question
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Remove duplicate questions.
 *
 * No additional LLM call.
 */
export function removeDuplicates(questions: MCQResponse["questions"]): MCQResponse["questions"] {
  const seen = new Set<string>();

  return questions.filter((mcq) => {
    const normalized = normalizeQuestion(mcq.question);

    if (seen.has(normalized)) {
      return false;
    }

    seen.add(normalized);

    return true;
  });
}
