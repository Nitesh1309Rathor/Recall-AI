import { Router } from "express";
import { FlashcardController } from "../controller/Flashcard.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const flashcardRouter = Router();

flashcardRouter.use(requireAuth);
flashcardRouter.post("/generate", FlashcardController.generate);
flashcardRouter.get("/", FlashcardController.list);
flashcardRouter.get("/:setId", FlashcardController.getById);
flashcardRouter.delete("/:setId", FlashcardController.delete);

export default flashcardRouter;
