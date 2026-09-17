import { Router } from "express";
import { DocumentService } from "../services/repo/document.Service";
import { AuthenticatedRequest, requireAuth } from "../middlewares/auth.middleware";

const documentRouter = Router();

documentRouter.get("/", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const documents = await DocumentService.getDocuments(req.user!.id);

    return res.json(documents);
  } catch (error) {
    console.error("Failed to fetch documents:", error);

    return res.status(500).json({
      error: error instanceof Error ? error.message : "Failed to fetch documents",
    });
  }
});

export default documentRouter;
