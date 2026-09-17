import { Router } from "express";
import { upload } from "../middlewares/uploadPdf";
import { IngestController } from "../controller/Ingest.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const ingestRouter = Router();

ingestRouter.post("/pdf", requireAuth, upload.single("file"), IngestController.pdf);

export default ingestRouter;
