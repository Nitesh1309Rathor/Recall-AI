import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "./config/env";
import ingestRouter from "./routes/ingest.route";
import mcqRouter from "./routes/mcqs.route";
import documentRouter from "./routes/document.route";
import authRouter from "./routes/auth.route";

const app = express();

const allowedOrigins = new Set([env.ALLOWED_URL, "http://localhost:3000"]);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`Origin ${origin} is not allowed by CORS`));
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/ingest", ingestRouter);
app.use("/api/ask", mcqRouter);
app.use("/api/documents", documentRouter);
app.use("/api/auth", authRouter);

export default app;
