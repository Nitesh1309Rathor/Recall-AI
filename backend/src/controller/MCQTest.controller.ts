import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { MCQTestService } from "../services/mcqs/mcqTest.service";

function validId(value: unknown): value is string {
  return typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export const MCQTestController = {
  async generate(req: AuthenticatedRequest, res: Response) {
    try {
      const { documentId, count, difficulty } = req.body;
      const requestedCount = Number(count);
      if (
        !validId(documentId) ||
        !Number.isInteger(requestedCount) ||
        requestedCount < 1 ||
        requestedCount > 50 ||
        !["Easy", "Medium", "Hard"].includes(difficulty)
      )
        return res.status(400).json({ message: "Valid documentId, count, and difficulty are required" });
      return res.status(200).json(await MCQTestService.generate(documentId, requestedCount, difficulty, req.user!.id));
    } catch (error) {
      console.error("MCQ test generation error:", error);
      if (error instanceof Error && error.message === "Document not found") return res.status(404).json({ message: error.message });
      return res.status(500).json({ message: "Failed to generate MCQ test" });
    }
  },

  async submit(req: AuthenticatedRequest, res: Response) {
    try {
      const { testId } = req.params;
      const { answers } = req.body;
      if (!validId(testId) || !Array.isArray(answers)) return res.status(400).json({ message: "Valid testId and answers are required" });
      return res.json(await MCQTestService.submit(testId, req.user!.id, answers));
    } catch (error) {
      console.error("MCQ test submission error:", error);
      if (error instanceof Error && ["Test not found", "Test has already been submitted"].includes(error.message))
        return res.status(error.message === "Test not found" ? 404 : 409).json({ message: error.message });
      if (error instanceof Error && error.message.startsWith("Invalid")) return res.status(400).json({ message: error.message });
      return res.status(500).json({ message: "Failed to submit MCQ test" });
    }
  },

  async list(req: AuthenticatedRequest, res: Response) {
    return res.json(await MCQTestService.list(req.user!.id));
  },
  async progress(req: AuthenticatedRequest, res: Response) {
    return res.json(await MCQTestService.progress(req.user!.id));
  },
  async getById(req: AuthenticatedRequest, res: Response) {
    if (!validId(req.params.testId)) return res.status(400).json({ message: "Invalid test id" });
    const result = await MCQTestService.getById(req.params.testId, req.user!.id);
    return result ? res.json(result) : res.status(404).json({ message: "Test not found" });
  },
  async delete(req: AuthenticatedRequest, res: Response) {
    if (!validId(req.params.testId)) return res.status(400).json({ message: "Invalid test id" });
    const result = await MCQTestService.delete(req.params.testId, req.user!.id);
    return result.count ? res.json({ message: "Test deleted" }) : res.status(404).json({ message: "Test not found" });
  },
};
