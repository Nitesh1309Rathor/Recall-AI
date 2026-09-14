import { Chroma } from "@langchain/community/vectorstores/chroma";
import { Document } from "@langchain/core/documents";
import { getEmbeddings } from "../docs/embedder";

let store: Chroma | null = null;

export async function getChromaStore() {
  if (store) return store;

  store = new Chroma(getEmbeddings(), {
    collectionName: "all-in-one-assistant",
    url: "http://localhost:8000",
  });

  return store;
}

export async function addChunks(docs: Document[]): Promise<number> {
  if (!docs.length) return 0;

  console.log("Adding to Chroma...");
  console.log("Chunks:", docs.length);

  const store = await getChromaStore();

  const ids = docs.map((doc) => {
    const documentId = String(doc.metadata.documentId);

    const chunkId = Number(doc.metadata.chunkId);

    return `${documentId}#${chunkId}`;
  });

  console.log("IDs:", ids);

  await store.addDocuments(docs, {
    ids,
  });

  console.log("Added successfully!");

  return docs.length;
}
