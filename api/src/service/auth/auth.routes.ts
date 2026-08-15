import { Router } from "express";
import { z } from "zod";
import type { ApiManifest } from "@/routes/api.types";

import { loginUserController } from "./controllers/login.controller";
import { logoutController } from "./controllers/logout.controller";
import { registerUserController } from "./controllers/register.controller";
import { registerRequestSchema, loginRequestSchema } from "./auth.types";
import {
  HttpLocation,
  validateHttpRequest,
} from "@/middleware/request-validators";

export const authRouter = Router();

authRouter.post(
  "/register",
  validateHttpRequest(registerRequestSchema, HttpLocation.Body),
  registerUserController,
);
authRouter.post(
  "/login",
  validateHttpRequest(loginRequestSchema, HttpLocation.Body),
  loginUserController,
);
authRouter.post("/logout", logoutController);

export const authApi: ApiManifest = {
  path: "/v1",
  router: authRouter,
};

export const authRoutes = authRouter.stack.map((layer) => layer.route?.path);
export const AUTH_PATH = "/v1";
