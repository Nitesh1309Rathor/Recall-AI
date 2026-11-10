import prisma from "../../lib/prisma";

export const FlashcardRepository = {
  async findDocumentForUser(documentId: string, userId: string) {
    return prisma.document.findFirst({
      where: { id: documentId, userId },
      select: { id: true, title: true },
    });
  },

  async createSetWithCards(input: { title: string; userId: string; documentId: string; cards: { front: string; back: string }[] }) {
    return prisma.$transaction((transaction) =>
      transaction.flashcardSet.create({
        data: {
          title: input.title,
          userId: input.userId,
          documentId: input.documentId,
          cards: {
            create: input.cards.map((card, index) => ({
              front: card.front,
              back: card.back,
              order: index,
            })),
          },
        },
        include: { cards: { orderBy: { order: "asc" } } },
      }),
    );
  },

  async findAllForUser(userId: string) {
    return prisma.flashcardSet.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        documentId: true,
        createdAt: true,
        _count: { select: { cards: true } },
        document: { select: { title: true } },
      },
    });
  },

  async findByIdForUser(setId: string, userId: string) {
    return prisma.flashcardSet.findFirst({
      where: { id: setId, userId },
      include: {
        document: { select: { title: true } },
        cards: { orderBy: { order: "asc" } },
      },
    });
  },

  async deleteForUser(setId: string, userId: string) {
    return prisma.flashcardSet.deleteMany({
      where: { id: setId, userId },
    });
  },
};
