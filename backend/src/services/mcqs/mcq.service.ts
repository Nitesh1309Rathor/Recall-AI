import { MCQResponse } from "../../lib/schema";
import { ChunkService } from "../repo/chunks.service";
import {
  ChunkData,
  createBatches,
  generateBatchMCQs,
  generateSingleCall,
  getTotalCharacters,
  MAX_SINGLE_CALL_CHARS,
  removeDuplicates,
} from "./mcqGeneration.service";

export async function generateMCQs(documentId: string, requestedCount: number): Promise<MCQResponse> {
  // ----------------------------------------
  // 1. Get ALL chunks
  // ----------------------------------------

  const chunks = await ChunkService.getChunksFromDocumentId(documentId);

  if (!chunks.length) {
    throw new Error("No chunks found for this document");
  }

  console.log(`Total chunks: ${chunks.length}`);

  // ----------------------------------------
  // 2. Convert Prisma chunks
  //    to the format we need
  // ----------------------------------------

  const chunkData: ChunkData[] = chunks.map((chunk) => ({
    chunkIndex: chunk.chunkIndex,
    content: chunk.content,
  }));

  // ----------------------------------------
  // 3. Calculate document size
  // ----------------------------------------

  const totalChars = getTotalCharacters(chunkData);

  console.log(`Total characters: ${totalChars}`);

  // ----------------------------------------
  // 4. SMALL DOCUMENT
  // ----------------------------------------

  if (totalChars <= MAX_SINGLE_CALL_CHARS) {
    console.log("Document fits in single-call limit");

    return generateSingleCall(chunkData, requestedCount);
  }

  // ----------------------------------------
  // 5. LARGE DOCUMENT
  // ----------------------------------------

  console.log("Document exceeds single-call limit");

  const batches = createBatches(chunkData);

  console.log(`Created ${batches.length} batches`);

  // ----------------------------------------
  // 6. Generate batch-wise
  // ----------------------------------------

  const result = await generateBatchMCQs(batches, requestedCount);

  // ----------------------------------------
  // 7. Remove duplicates
  // ----------------------------------------

  const uniqueQuestions = removeDuplicates(result.questions);

  console.log(`After deduplication: ${uniqueQuestions.length}`);

  // ----------------------------------------
  // 8. Return requested number
  // ----------------------------------------

  return {
    questions: uniqueQuestions.slice(0, requestedCount),
  };
}
