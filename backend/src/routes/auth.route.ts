import { Router } from "express";
import { AuthController } from "../controller/Auth.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const authRouter = Router();

authRouter.post("/signup", AuthController.signup);
authRouter.post("/login", AuthController.login);
authRouter.get("/me", requireAuth, AuthController.me);

export default authRouter;
