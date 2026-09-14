import { Router } from "express";
import { upload } from "../middlewares/uploadPdf";
import { ingestPdf } from "../services/ingestPdf.service";

const ingestRouter = Router();

ingestRouter.post("/pdf", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "PDF file is required",
      });
    }

    if (req.file.mimetype !== "application/pdf") {
      return res.status(400).json({
        message: "Only PDF files are allowed",
      });
    }

    const result = await ingestPdf(req.file.buffer, req.file.originalname);

    return res.status(200).json(result);
  } catch (error) {
    console.error("PDF ingestion error:", error);

    return res.status(500).json({
      error: error instanceof Error ? error.message : "Failed to ingest PDF",
    });
  }
});

export default ingestRouter;
