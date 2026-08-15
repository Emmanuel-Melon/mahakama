import { Router } from "express";
import { z } from "zod";

import {
  HttpLocation,
  validateHttpRequest,
} from "@/middleware/request-validators";
import type { ApiManifest } from "@/routes/api.types";

import { getNotificationsController } from "./controllers/get-notifications.controller";
import { getNotificationPreferencesController } from "./controllers/get-preferences.controller";
import { setNotificationPreferencesController } from "./controllers/set-preferences.controller";
import { updateNotificationPreferencesController } from "./controllers/update-preferences.controller";
import { notificationPreferencesInsertSchema } from "./notifications.types";

const notificationsRouter = Router();

notificationsRouter.get("/", getNotificationsController);
notificationsRouter.post("/set", setNotificationPreferencesController);
notificationsRouter.get("/preferences", getNotificationPreferencesController);
notificationsRouter.put(
  "/preferences/update",
  validateHttpRequest(notificationPreferencesInsertSchema, HttpLocation.Body),
  updateNotificationPreferencesController,
);

export const notificationsApi: ApiManifest = {
  path: "/v1/notifications",
  router: notificationsRouter,
};

export default notificationsRouter;
