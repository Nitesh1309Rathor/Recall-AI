import { MCQResponse } from "../../lib/schema";
import { generateMCQs, Difficulty } from "./mcq.service";
import { MCQTestRepository } from "../repo/mcqTest.repository";

export async function generateTest(documentId: string, requestedCount: number, difficulty: Difficulty, userId: string) {
  const document = await MCQTestRepository.findDocumentForUser(documentId, userId);
  if (!document) throw new Error("Document not found");
  const generated: MCQResponse = await generateMCQs(documentId, requestedCount, difficulty);
  return MCQTestRepository.createTest({ userId, documentId, totalQuestions: generated.questions.length, questions: generated.questions });
}

export async function submitTest(testId: string, userId: string, answers: { questionId: string; selectedAnswer?: string | null }[]) {
  const test = await MCQTestRepository.findByIdForUser(testId, userId);
  if (!test) throw new Error("Test not found");
  if (test.status === "COMPLETED") throw new Error("Test has already been submitted");

  const submitted = new Map(answers.map((answer) => [answer.questionId, answer.selectedAnswer ?? null]));
  const allowedIds = new Set(test.questions.map((question) => question.id));
  if (answers.some((answer) => !allowedIds.has(answer.questionId))) throw new Error("Invalid question id");

  const results = test.questions.map((question) => {
    const selectedAnswer = submitted.get(question.id) ?? null;
    if (selectedAnswer !== null && !(question.options as string[]).includes(selectedAnswer)) throw new Error("Invalid answer option");
    return { questionId: question.id, selectedAnswer, isCorrect: selectedAnswer === null ? null : selectedAnswer === question.correctAnswer };
  });
  const correct = results.filter((result) => result.isCorrect === true).length;
  const unanswered = results.filter((result) => result.selectedAnswer === null).length;
  const wrong = results.length - correct - unanswered;
  const score = results.length ? Math.round((correct / results.length) * 100) : 0;
  const updated = await MCQTestRepository.submitTest(testId, userId, results, {
    correctAnswers: correct,
    wrongAnswers: wrong,
    unansweredQuestions: unanswered,
    score,
  });
  if (!updated) throw new Error("Test not found");
  return updated;
}

export const MCQTestService = {
  generate: generateTest,
  submit: submitTest,
  list: (userId: string) => MCQTestRepository.findAllForUser(userId),
  getById: (testId: string, userId: string) => MCQTestRepository.findByIdForUser(testId, userId),
  delete: (testId: string, userId: string) => MCQTestRepository.deleteForUser(testId, userId),
  progress: (userId: string) => MCQTestRepository.getProgress(userId),
};
