import { Router } from "express";
import type { ApiManifest } from "@/routes/api.types";

import { loginController } from "./controllers/login.controller";
import { logoutController } from "./controllers/logout.controller";
import { signupController } from "./controllers/singup.controller";
import { getMeController } from "./controllers/get-me.controller";
import { refreshController } from "./controllers/refresh.controller";
import { requestResetController } from "./controllers/request-reset.controller";
import { resetPasswordController } from "./controllers/reset-password.controller";
import { verifyEmailController } from "./controllers/verify-email.controller";
import { registerRequestSchema, loginRequestSchema } from "./auth.types";
import {
  HttpLocation,
  validateHttpRequest,
} from "@/middleware/request-validators";

export const authRouter = Router();

authRouter.post(
  "/register",
  validateHttpRequest(registerRequestSchema, HttpLocation.Body),
  signupController,
);
authRouter.post(
  "/login",
  validateHttpRequest(loginRequestSchema, HttpLocation.Body),
  loginController,
);
authRouter.post("/logout", logoutController);
authRouter.get("/me", getMeController);
authRouter.post("/refresh", refreshController);
authRouter.post("/request-reset", requestResetController);
authRouter.post("/reset-password", resetPasswordController);
authRouter.post("/verify-email", verifyEmailController);

export const authApi: ApiManifest = {
  path: "/v1",
  router: authRouter,
};

export const authRoutes = authRouter.stack.map((layer) => layer.route?.path);
export const AUTH_PATH = "/v1";
