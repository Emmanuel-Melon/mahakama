import { Router } from "express";
import { registerUserController } from "./controllers/register.controller";
import { loginUserController } from "./controllers/login.controller";
import { logoutController } from "./controllers/logout.controller";

export const authRouter = Router();
authRouter.post("/register", registerUserController);
authRouter.post("/login", loginUserController);
authRouter.post("/logout", logoutController);

export const authRoutes = authRouter.stack.map((layer) => layer.route?.path);
export const AUTH_PATH = "/v1";
