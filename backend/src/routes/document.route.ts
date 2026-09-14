import { Router } from "express";
import { DocumentService } from "../services/document.Service";

const documentRouter = Router();

documentRouter.get("/", async (_req, res) => {
  try {
    const documents = await DocumentService.getDocuments();

    return res.json(documents);
  } catch (error) {
    console.error("Failed to fetch documents:", error);

    return res.status(500).json({
      error: error instanceof Error ? error.message : "Failed to fetch documents",
    });
  }
});

export default documentRouter;
