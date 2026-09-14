import prisma from "../lib/prisma";

export const ChunkService = {
  async createChunk(documentId: string, chunks: string[]) {
    return await prisma.chunk.createMany({
      data: chunks.map((chunk, index) => ({
        documentId,
        chunkIndex: index,
        content: chunk,
      })),
    });
  },

  async deleteChunks(documentId: string) {
    return prisma.chunk.deleteMany({
      where: {
        documentId,
      },
    });
  },

  async getChunksFromDocumentId(documentId: string) {
    return prisma.chunk.findMany({
      where: {
        documentId,
      },
      orderBy: {
        chunkIndex: "asc",
      },
    });
  },
};
