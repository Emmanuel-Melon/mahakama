import { Router } from "express";
import { disablePreferenceController } from "./controllers/disabler-preference.controller";
import { getPreferenceController } from "./controllers/get-preference.controller";
import { getPreferencesController } from "./controllers/get-preferences.controller";
import { getProvidersController } from "./controllers/get-providers.controller";
import { getStrategiesController } from "./controllers/get-strategies.controller";
import { upsertPreferenceController } from "./controllers/upsert-preference.controller";

export const INFERENCE_PATH = "/inference";
export const inferenceRouter = Router();

// Preferences routes
inferenceRouter.get("/preferences/:userId", getPreferencesController);
inferenceRouter.get(
  "/preferences/:userId/:strategyKey",
  getPreferenceController,
);
inferenceRouter.put(
  "/preferences/:userId/:strategyKey",
  upsertPreferenceController,
);
inferenceRouter.put(
  "/preferences/:userId/:strategyKey",
  disablePreferenceController,
);

// Discovery routes
inferenceRouter.get("/providers", getProvidersController);
inferenceRouter.get("/strategies", getStrategiesController);
