import { Router } from "express";
import { MCQTestController } from "../controller/MCQTest.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();
router.use(requireAuth);
router.post("/tests/generate", MCQTestController.generate);
router.post("/tests/:testId/submit", MCQTestController.submit);
router.get("/tests", MCQTestController.list);
router.get("/tests/:testId", MCQTestController.getById);
router.delete("/tests/:testId", MCQTestController.delete);
router.get("/progress", MCQTestController.progress);

export default router;
