import { ChunkService } from "../docs/chunks.service";
import { FlashcardRepository } from "../repo/flashcard.repository";
import { generateFlashcardsFromChunks } from "./flashcardGeneration.service";

export async function generateFlashcards(documentId: string, requestedCount: number, userId: string) {
  const document = await FlashcardRepository.findDocumentForUser(documentId, userId);
  if (!document) throw new Error("Document not found");

  const chunks = await ChunkService.getChunksFromDocumentId(documentId);
  if (!chunks.length) throw new Error("No chunks found for this document");

  const cards = await generateFlashcardsFromChunks(
    chunks.map((chunk) => ({ chunkIndex: chunk.chunkIndex, content: chunk.content })),
    requestedCount,
  );

  return FlashcardRepository.createSetWithCards({
    title: document.title,
    userId,
    documentId,
    cards,
  });
}

export const FlashcardService = {
  generate: generateFlashcards,
  getAll: (userId: string) => FlashcardRepository.findAllForUser(userId),
  getById: (setId: string, userId: string) => FlashcardRepository.findByIdForUser(setId, userId),
  delete: (setId: string, userId: string) => FlashcardRepository.deleteForUser(setId, userId),
};
