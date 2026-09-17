import { HashService } from "../repo/hash.service";
import { DocumentService } from "../repo/document.Service";
import { chunkText } from "../../docs/textToChunks";
import { addChunks } from "../vectorStore.service";
import { extractPdfText } from "../../docs/pdfParser";
import { ChunkService } from "../repo/chunks.service";
import { DocumentType } from "../../generated/prisma";

export async function ingestPdf(buffer: Uint8Array, fileName: string, userId: string) {
  console.log("Starting PDF ingestion...");

  // 1. Extract text
  const text = await extractPdfText(Buffer.from(buffer));

  console.log("PDF extracted");
  console.log("Text length:", text.length);

  if (!text.trim()) {
    throw new Error("Could not extract text from PDF");
  }

  // 2. Generate content hash
  const hash = HashService.generateHash(text);

  // 3. Check duplicate
  const existing = await DocumentService.findHash(hash);

  if (existing) {
    console.log("Duplicate PDF detected");

    return {
      isDuplicate: true,
      document: existing,
      chunks: [],
    };
  }

  // 4. Create Document
  const document = await DocumentService.createDocument({
    title: fileName,
    source: fileName,
    type: DocumentType.PDF,
    contentHash: hash,
    userId,
  });

  console.log("Document created:", document.id);

  // 5. Create chunks
  const chunksDocs = await chunkText(text, document.id, fileName);

  console.log("Chunks created:", chunksDocs.length);

  // 6. Save chunks in PostgreSQL
  const chunks = chunksDocs.map((doc) => doc.pageContent);

  await ChunkService.createChunk(document.id, chunks);

  console.log("Chunks saved to PostgreSQL");

  // 7. Persist the count before the external vector-store operation.
  // This keeps the document usable even if Chroma is temporarily unavailable.
  const updatedDocument = await DocumentService.updateChunksCount(document.id, chunksDocs.length);

  // 8. Add chunks to ChromaDB
  await addChunks(chunksDocs);

  console.log("Chunks added to ChromaDB");

  return {
    isDuplicate: false,
    document: updatedDocument,
    chunks: chunksDocs,
  };
}
