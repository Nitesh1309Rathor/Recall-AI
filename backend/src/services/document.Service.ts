import prisma from "../lib/prisma";
import { DocumentType } from "../generated/prisma";

type CreateDocumentInput = {
  title: string;
  source?: string;
  type: DocumentType;
  contentHash: string;
};

export const DocumentService = {
  async createDocument(doc: CreateDocumentInput) {
    return prisma.document.create({
      data: {
        title: doc.title,
        source: doc.source,
        type: doc.type,
        contentHash: doc.contentHash,
      },
    });
  },

  async updateChunksCount(
    documentId: string,
    chunkCount: number
  ) {
    return prisma.document.update({
      where: { id: documentId },
      data: { chunkCount },
    });
  },

  async findHash(contentHash: string) {
    return prisma.document.findUnique({
      where: { contentHash },
    });
  },

  async getDocuments() {
    return prisma.document.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  async deleteDocument(id: string) {
    return prisma.document.delete({
      where: { id },
    });
  },
};