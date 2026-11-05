import { Request, Response } from "express";
import { ingestPdf } from "../services/Ingest/ingestPdf.service";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { ingestUrl } from "../services/Ingest/ingestURL.service";

export const IngestController = {
  async pdf(req: AuthenticatedRequest, res: Response) {
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

      const result = await ingestPdf(req.file.buffer, req.file.originalname, req.user!.id);

      return res.status(200).json(result);
    } catch (error) {
      console.error("PDF ingestion error:", error);

      return res.status(500).json({
        error: error instanceof Error ? error.message : "Failed to ingest PDF",
      });
    }
  },

  async url(req: AuthenticatedRequest, res: Response) {
    try {
      const { url } = req.body;

      if (!url) {
        return res.status(400).json({
          message: "URL is required",
        });
      }

      const result = await ingestUrl(url, req.user!.id);

      return res.json(result);
    } catch (error) {
      console.error("URL ingestion failed:", error);

      return res.status(500).json({
        error: error instanceof Error ? error.message : "Failed to ingest document",
      });
    }
  },
};
