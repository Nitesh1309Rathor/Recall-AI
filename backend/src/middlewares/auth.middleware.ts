import { Request, Response, NextFunction } from "express";
import { SessionService } from "../services/Auth/session.service";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export async function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const sessionId = req.cookies.sessionId;

    if (!sessionId) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const user = await SessionService.getUser(sessionId);

    if (!user) {
      return res.status(401).json({
        message: "Invalid or expired session",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
