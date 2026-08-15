import { Router } from "express";
import { z } from "zod";

import type { ApiManifest } from "@/routes/api.types";

import { disablePreferenceController } from "./controllers/disabler-preference.controller";
import { getPreferenceController } from "./controllers/get-preference.controller";
import { getPreferencesController } from "./controllers/get-preferences.controller";
import { getProvidersController } from "./controllers/get-providers.controller";
import { getStrategiesController } from "./controllers/get-strategies.controller";
import { upsertPreferenceController } from "./controllers/upsert-preference.controller";
import {
  HttpLocation,
  validateHttpRequest,
} from "@/middleware/request-validators";

export const INFERENCE_PATH = "/v1/inference";
export const inferenceRouter = Router();

// Preferences routes
inferenceRouter.get(
  "/preferences/:userId",
  validateHttpRequest(
    z.object({ userId: z.string().uuid() }),
    HttpLocation.Params,
  ),
  getPreferencesController,
);

inferenceRouter.get(
  "/preferences/:userId/:strategyKey",
  validateHttpRequest(
    z.object({
      userId: z.string().uuid(),
      strategyKey: z.string(),
    }),
    HttpLocation.Params,
  ),
  getPreferenceController,
);

inferenceRouter.put(
  "/preferences/:userId/:strategyKey",
  validateHttpRequest(
    z.object({
      userId: z.string().uuid(),
      strategyKey: z.string(),
    }),
    HttpLocation.Params,
  ),
  validateHttpRequest(
    z.object({
      provider: z.enum(["gemini", "ollama", "claude"]),
      model: z.string().optional(),
    }),
    HttpLocation.Body,
  ),
  upsertPreferenceController,
);

inferenceRouter.put(
  "/preferences/:userId/:strategyKey",
  validateHttpRequest(
    z.object({
      userId: z.string().uuid(),
      strategyKey: z.string(),
    }),
    HttpLocation.Params,
  ),
  disablePreferenceController,
);

// Discovery routes
inferenceRouter.get("/providers", getProvidersController);
inferenceRouter.get("/strategies", getStrategiesController);

export const inferenceApi: ApiManifest = {
  path: "/v1/inference",
  router: inferenceRouter,
};

export default inferenceRouter;
