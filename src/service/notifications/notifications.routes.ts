import { Router } from "express";
import { getNotificationsController } from "./controllers/get-notifications.controller";
import { setNotificationPreferencesController } from "./controllers/set-preferences.controller";
import { getNotificationPreferencesController } from "./controllers/get-preferences.controller";
import { updateNotificationPreferencesController } from "./controllers/update-preferences.controller";

const notificationsRouter = Router();

notificationsRouter.get("/", getNotificationsController);
notificationsRouter.post("/set", setNotificationPreferencesController);
notificationsRouter.get("/preferences", getNotificationPreferencesController);
notificationsRouter.put(
  "/preferences/update",
  updateNotificationPreferencesController,
);

export default notificationsRouter;
export const NOTIFICATIONS_PATH = "/v1/notifications";
