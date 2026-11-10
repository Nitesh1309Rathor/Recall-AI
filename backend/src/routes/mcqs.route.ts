import { Request, Response, Router } from "express";
import { generateMCQs } from "../services/mcqs/mcq.service";

const mcqRouter = Router();

mcqRouter.post("/mcqs", async (req: Request, res: Response) => {
  try {
    const { documentId, count, difficulty } = req.body;

    if (!documentId) {
      return res.status(400).json({
        message: "Document is Not Found!",
      });
    }

    const allowedDifficulties = ["Easy", "Medium", "Hard"] as const;

    if (!allowedDifficulties.includes(difficulty)) {
      return res.status(400).json({
        message: "Difficulty must be Easy, Medium, or Hard",
      });
    }

    const requestedCount = Number(count);

    if (!Number.isInteger(requestedCount) || requestedCount < 1 || requestedCount > 50) {
      return res.status(400).json({
        message: "Requested Questions count should be between 1 and 50",
      });
    }

    const result = await generateMCQs(documentId, requestedCount, difficulty);

    return res.status(200).json({
      documentId,
      count: result.questions.length,
      questions: result.questions,
    });
  } catch (error) {
    console.error("MCQ generation error:", error);

    return res.status(500).json({
      message: "Failed to generate MCQs",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default mcqRouter;
