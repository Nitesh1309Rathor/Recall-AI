import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { FlashcardService } from "../services/flashcards/flashcard.service";

function validId(value: string | string[]) {
  return typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export const FlashcardController = {
  async generate(req: AuthenticatedRequest, res: Response) {
    try {
      const { documentId, requestedCount } = req.body;
      const count = Number(requestedCount);
      if (!validId(documentId) || !Number.isInteger(count) || count < 1 || count > 50) {
        return res.status(400).json({ message: "documentId and requestedCount between 1 and 50 are required" });
      }
      const result = await FlashcardService.generate(documentId, count, req.user!.id);
      return res.status(200).json(result);
    } catch (error) {
      console.error("Flashcard generation error:", error);
      if (error instanceof Error && error.message === "Document not found") {
        return res.status(404).json({ message: "Document not found" });
      }

      if (error instanceof Error && (error.message === "No chunks found for this document" || error.message.includes("not contain enough unique content"))) {
        return res.status(422).json({ message: error.message });
      }

      return res.status(500).json({ message: "Failed to generate flashcards" });
    }
  },

  async list(req: AuthenticatedRequest, res: Response) {
    try {
      return res.json(await FlashcardService.getAll(req.user!.id));
    } catch (error) {
      console.error("Failed to fetch flashcard sets:", error);
      return res.status(500).json({ message: "Failed to fetch flashcard sets" });
    }
  },

  async getById(req: AuthenticatedRequest, res: Response) {
    try {
      const { setId } = req.params;
      if (typeof setId !== "string" || !validId(setId)) return res.status(400).json({ message: "Invalid flashcard set id" });

      const result = await FlashcardService.getById(setId, req.user!.id);

      if (!result) return res.status(404).json({ message: "Flashcard set not found" });
      return res.json(result);
    } catch (error) {
      console.error("Failed to fetch flashcard set:", error);
      return res.status(500).json({ message: "Failed to fetch flashcard set" });
    }
  },

  async delete(req: AuthenticatedRequest, res: Response) {
    try {
      const { setId } = req.params;

      if (typeof setId !== "string" || !validId(setId)) return res.status(400).json({ message: "Invalid flashcard set id" });

      const result = await FlashcardService.delete(setId, req.user!.id);

      if (!result.count) return res.status(404).json({ message: "Flashcard set not found" });

      return res.json({ message: "Flashcard set deleted" });
    } catch (error) {
      console.error("Failed to delete flashcard set:", error);
      return res.status(500).json({ message: "Failed to delete flashcard set" });
    }
  },
};
