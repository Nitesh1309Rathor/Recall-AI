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

documentRouter.delete("/:id", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const id = req.params.id;

    if (Array.isArray(id)) {
      return res.status(400).json({
        message: "Invalid document id",
      });
    }

    const result = await DocumentService.deleteUserDocument(id, req.user!.id);

    if (result.count === 0) {
      return res.status(404).json({
        message: "Document not found",
      });
    }

    return res.json({
      message: "Document deleted",
    });
  } catch (error) {
    console.error("Failed to delete document:", error);

    return res.status(500).json({
      error: error instanceof Error ? error.message : "Failed to delete document",
    });
  }
});

export default documentRouter;
