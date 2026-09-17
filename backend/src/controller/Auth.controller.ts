import { Request, Response } from "express";
import { z } from "zod";
import { AuthService } from "../services/Auth/auth.service";
import { SessionService } from "../services/Auth/session.service";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const AuthController = {
  async signup(req: Request, res: Response) {
    try {
      const result = signupSchema.safeParse(req.body);

      if (!result.success) {
        return res.status(400).json({
          message: "Invalid email or password",
          errors: result.error.flatten(),
        });
      }

      const user = await AuthService.signup(result.data.email, result.data.password);

      return res.status(201).json({
        message: "User created successfully",
        user,
      });
    } catch (error) {
      if (error instanceof Error && error.message === "User already exists") {
        return res.status(409).json({
          message: error.message,
        });
      }

      console.error("Signup error:", error);

      return res.status(500).json({
        message: "Internal server error",
      });
    }
  },

  async login(req: Request, res: Response) {
    try {
      const result = signupSchema.safeParse(req.body);

      if (!result.success) {
        return res.status(400).json({
          message: "Invalid email or password",
          errors: result.error.flatten(),
        });
      }

      const user = await AuthService.login(result.data.email, result.data.password);
      const session = await SessionService.create(user.id);

      res.cookie("sessionId", session.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV == "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({
        message: "Login successful",
        user,
      });
    } catch (error) {
      if (error instanceof Error && error.message === "Invalid email or password") {
        return res.status(401).json({
          message: error.message,
        });
      }

      console.error("Login error:", error);

      return res.status(500).json({
        message: "Internal server error",
      });
    }
  },

  async me(req: AuthenticatedRequest, res: Response) {
    return res.status(200).json({
      user: req.user,
    });
  },
};
