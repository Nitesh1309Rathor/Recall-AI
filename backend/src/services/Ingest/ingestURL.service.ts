import { Document } from "@langchain/core/documents";
import { scrape } from "../../docs/scrapeURL";
import { HashService } from "../repo/hash.service";
import { DocumentService } from "../repo/document.Service";
import { DocumentType } from "../../generated/prisma";
import { chunkText } from "../../docs/textToChunks";
import { ChunkService } from "../repo/chunks.service";
import { addChunks } from "../vectorStore.service";

export async function ingestUrl(url: string, userId: string) {
  // 1. Scrape webpage
  const { title, text } = await scrape(url);

  const cleanedText = text.trim();

  // 2. Make sure useful content was extracted
  if (!cleanedText) {
    throw new Error("Could not extract readable content from this URL");
  }

  // 3. Generate hash from extracted content
  const hash = HashService.generateHash(cleanedText);

  // 4. Check whether this content already exists
  const existing = await DocumentService.findHash(hash);

  if (existing) {
    return {
      isDuplicate: true,
      document: existing,
      chunks: [],
    };
  }

  // 5. Create document for authenticated user
  const document = await DocumentService.createDocument({
    title,
    source: url,
    type: DocumentType.URL,
    contentHash: hash,
    userId,
  });

  // 6. Convert text into chunks
  const chunkDocs: Document[] = await chunkText(cleanedText, document.id, url);

  // 7. Save chunks in PostgreSQL
  const chunks = chunkDocs.map((doc) => doc.pageContent);

  await ChunkService.createChunk(document.id, chunks);

  // 8. Generate and store embeddings in Chroma
  await addChunks(chunkDocs);

  // 9. Update chunk count
  const updatedDocument = await DocumentService.updateChunksCount(document.id, chunkDocs.length);

  return {
    isDuplicate: false,
    document: updatedDocument,
    chunks: chunkDocs,
  };
}
