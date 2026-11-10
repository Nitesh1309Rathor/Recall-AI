-- CreateEnum
CREATE TYPE "MCQTestStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED');

-- CreateTable
CREATE TABLE "MCQTest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "totalQuestions" INTEGER NOT NULL,
    "correctAnswers" INTEGER NOT NULL DEFAULT 0,
    "wrongAnswers" INTEGER NOT NULL DEFAULT 0,
    "unansweredQuestions" INTEGER NOT NULL DEFAULT 0,
    "status" "MCQTestStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    CONSTRAINT "MCQTest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MCQTestQuestion" (
    "id" TEXT NOT NULL,
    "testId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "options" JSONB NOT NULL,
    "correctAnswer" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "selectedAnswer" TEXT,
    "isCorrect" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MCQTestQuestion_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "MCQTest_userId_idx" ON "MCQTest"("userId");
CREATE INDEX "MCQTest_documentId_idx" ON "MCQTest"("documentId");
CREATE INDEX "MCQTest_userId_status_idx" ON "MCQTest"("userId", "status");
CREATE INDEX "MCQTestQuestion_testId_idx" ON "MCQTestQuestion"("testId");
CREATE UNIQUE INDEX "MCQTestQuestion_testId_order_key" ON "MCQTestQuestion"("testId", "order");

ALTER TABLE "MCQTest" ADD CONSTRAINT "MCQTest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "MCQTest" ADD CONSTRAINT "MCQTest_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "MCQTestQuestion" ADD CONSTRAINT "MCQTestQuestion_testId_fkey" FOREIGN KEY ("testId") REFERENCES "MCQTest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
