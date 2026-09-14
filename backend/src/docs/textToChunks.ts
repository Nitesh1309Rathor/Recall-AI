import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Document } from "@langchain/core/documents";

export async function chunkText(text: string, documentId: string, source: string): Promise<Document[]> {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const chunks = await splitter.createDocuments([text]);

  return chunks.map((chunk, index) => {
    chunk.metadata = {
      documentId,
      source,
      chunkId: index,
    };

    return chunk;
  });
}
