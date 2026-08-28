import { Router } from "express";
import type { ApiManifest } from "@/routes/api.types";
import { useAuthentication } from "@/routes/api.rules";

import { loginController } from "./controllers/login.controller";
import { logoutController } from "./controllers/logout.controller";
import { signupController } from "./controllers/singup.controller";
import { getMeController } from "./controllers/get-me.controller";
import { refreshController } from "./controllers/refresh.controller";
import { requestResetController } from "./controllers/request-reset.controller";
import { resetPasswordController } from "./controllers/reset-password.controller";
import { verifyEmailController } from "./controllers/verify-email.controller";
import { resendVerification } from "./controllers/resend-verification.controller";
import { registerRequestSchema, loginRequestSchema } from "./auth.types";
import {
  HttpLocation,
  validateHttpRequest,
} from "@/middleware/request-validators";

export const authRouter = Router();

useAuthentication(authRouter, ["/me", "/logout"]);

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
authRouter.post("/resend-verification", resendVerification);

export const authApi: ApiManifest = {
  router: authRouter,
  path: "/auth",
  isPrivate: false,
};