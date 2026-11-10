import prisma from "../../lib/prisma";

export const MCQTestRepository = {
  async findDocumentForUser(documentId: string, userId: string) {
    return prisma.document.findFirst({ where: { id: documentId, userId }, select: { id: true, title: true } });
  },

  async createTest(input: {
    userId: string;
    documentId: string;
    totalQuestions: number;
    questions: { question: string; options: string[]; correctAnswer: string; explanation: string }[];
  }) {
    return prisma.mCQTest.create({
      data: {
        userId: input.userId,
        documentId: input.documentId,
        totalQuestions: input.totalQuestions,
        questions: { create: input.questions.map((question, index) => ({ ...question, options: question.options, order: index })) },
      },
      include: { questions: { orderBy: { order: "asc" } } },
    });
  },

  async findByIdForUser(testId: string, userId: string) {
    return prisma.mCQTest.findFirst({
      where: { id: testId, userId },
      include: { document: { select: { title: true } }, questions: { orderBy: { order: "asc" } } },
    });
  },

  async submitTest(
    testId: string,
    userId: string,
    results: { questionId: string; selectedAnswer: string | null; isCorrect: boolean | null }[],
    summary: { correctAnswers: number; wrongAnswers: number; unansweredQuestions: number; score: number },
  ) {
    return prisma.$transaction(async (transaction) => {
      const test = await transaction.mCQTest.findFirst({ where: { id: testId, userId } });
      if (!test) return null;
      if (test.status === "COMPLETED") throw new Error("Test has already been submitted");

      for (const result of results) {
        await transaction.mCQTestQuestion.update({
          where: { id: result.questionId },
          data: { selectedAnswer: result.selectedAnswer, isCorrect: result.isCorrect },
        });
      }

      return transaction.mCQTest.update({
        where: { id: testId },
        data: { ...summary, status: "COMPLETED", completedAt: new Date() },
        include: { document: { select: { title: true } }, questions: { orderBy: { order: "asc" } } },
      });
    });
  },

  async findAllForUser(userId: string) {
    return prisma.mCQTest.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        totalQuestions: true,
        correctAnswers: true,
        wrongAnswers: true,
        unansweredQuestions: true,
        score: true,
        status: true,
        createdAt: true,
        completedAt: true,
        document: { select: { title: true } },
      },
    });
  },

  async deleteForUser(testId: string, userId: string) {
    return prisma.mCQTest.deleteMany({ where: { id: testId, userId } });
  },

  async getProgress(userId: string) {
    const aggregate = await prisma.mCQTest.aggregate({
      where: { userId, status: "COMPLETED" },
      _count: { _all: true },
      _sum: { totalQuestions: true, correctAnswers: true, wrongAnswers: true },
    });
    const recentTests = await prisma.mCQTest.findMany({
      where: { userId, status: "COMPLETED" },
      orderBy: { completedAt: "desc" },
      take: 5,
      select: { id: true, score: true, totalQuestions: true, correctAnswers: true, completedAt: true, document: { select: { title: true } } },
    });
    const totalQuestions = aggregate._sum.totalQuestions ?? 0;
    const totalCorrect = aggregate._sum.correctAnswers ?? 0;
    return {
      totalCompletedTests: aggregate._count._all,
      totalQuestionsAttempted: totalQuestions,
      totalCorrectAnswers: totalCorrect,
      totalWrongAnswers: aggregate._sum.wrongAnswers ?? 0,
      overallAccuracy: totalQuestions ? Math.round((totalCorrect / totalQuestions) * 100) : 0,
      recentTests,
    };
  },
};
