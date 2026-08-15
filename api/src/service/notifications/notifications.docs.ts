import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { HttpStatus } from "@/lib/http/http.status";
import {
  defineApiResource,
  registerJsonApiSchemas,
  registerRoutes,
} from "@/lib/openapi/openapi.core";
import type { PathDefinition } from "@/lib/openapi/openapi.types";

import { notificationsApi } from "./notifications.routes";
import {
  notificationSelectSchema,
  notificationPreferencesSelectSchema,
  notificationPreferencesInsertSchema,
} from "./notifications.types";

export const notificationsRegistry = new OpenAPIRegistry();

const notificationApiResource = defineApiResource({
  select: notificationSelectSchema,
  insert: notificationPreferencesInsertSchema,
  update: notificationPreferencesInsertSchema.partial(),
});

export const NotificationApiSchemas = registerJsonApiSchemas({
  registry: notificationsRegistry,
  resourceType: "notification",
  pascalName: "Notification",
  schemas: notificationApiResource,
});

const notificationPreferencesApiResource = defineApiResource({
  select: notificationPreferencesSelectSchema,
  insert: notificationPreferencesInsertSchema,
  update: notificationPreferencesInsertSchema.partial(),
});

export const NotificationPreferencesApiSchemas = registerJsonApiSchemas({
  registry: notificationsRegistry,
  resourceType: "notification-preferences",
  pascalName: "NotificationPreferences",
  schemas: notificationPreferencesApiResource,
});

const notificationPaths: PathDefinition[] = [
  {
    handlerName: "getNotificationsController",
    method: "get",
    path: notificationsApi.path,
    summary: "Get current user's notifications",
    description:
      "Returns a paginated list of notifications for the authenticated user",
    security: [{ bearerAuth: [] }],
    successStatus: HttpStatus.SUCCESS,
    successSchema: NotificationApiSchemas.colResSchema,
    errorCodes: [401, 500],
  },
  {
    handlerName: "getNotificationPreferencesController",
    method: "get",
    path: `${notificationsApi.path}/preferences`,
    summary: "Get user's notification preferences",
    description: "Retrieve notification preferences for the authenticated user",
    security: [{ bearerAuth: [] }],
    successStatus: HttpStatus.SUCCESS,
    successSchema: NotificationPreferencesApiSchemas.singleResSchema,
    errorCodes: [401, 404],
  },
  {
    handlerName: "setInitialNotificationPreferencesController",
    method: "post",
    path: `${notificationsApi.path}/set`,
    summary: "Set initial notification preferences",
    description:
      "Create default notification preferences for the authenticated user",
    security: [{ bearerAuth: [] }],
    successStatus: HttpStatus.SUCCESS,
    successSchema: NotificationPreferencesApiSchemas.singleResSchema,
    errorCodes: [401, 404],
  },
  {
    handlerName: "updateNotificationPreferencesController",
    method: "put",
    path: `${notificationsApi.path}/preferences/update`,
    summary: "Update notification preferences",
    description: "Update notification preferences for the authenticated user",
    security: [{ bearerAuth: [] }],
    requestBodySchema: notificationPreferencesInsertSchema,
    successStatus: HttpStatus.SUCCESS,
    successSchema: NotificationPreferencesApiSchemas.singleResSchema,
    errorCodes: [400, 401, 404],
  },
];

registerRoutes({
  registry: notificationsRegistry,
  defaultTag: "Notifications v1",
  routes: notificationPaths,
});

notificationsRegistry.register("Notification", notificationSelectSchema);
notificationsRegistry.register(
  "NotificationPreferences",
  notificationPreferencesSelectSchema,
);
notificationsRegistry.register(
  "UpdateNotificationPreferences",
  notificationPreferencesInsertSchema,
);
