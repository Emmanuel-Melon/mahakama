import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import {
  notificationSelectSchema,
  notificationPreferencesSelectSchema,
  notificationPreferencesInsertSchema,
} from "./notifications.types";
import { HttpStatus } from "@/http-status";
import {
  createJsonApiResourceSchema,
  createJsonApiSingleResponseSchema,
  createJsonApiCollectionResponseSchema,
} from "@/lib/express/express.serializer";

const ErrorResponseRef = { $ref: "#/components/schemas/JsonApiErrorResponse" };
const notificationResourceSchema = createJsonApiResourceSchema(
  "notification",
  notificationSelectSchema,
);
const notificationSingleResponseSchema = createJsonApiSingleResponseSchema(
  notificationResourceSchema,
);
const notificationsCollectionResponseSchema =
  createJsonApiCollectionResponseSchema(notificationResourceSchema);

const notificationPreferencesResourceSchema = createJsonApiResourceSchema(
  "notification-preferences",
  notificationPreferencesSelectSchema,
);
const notificationPreferencesSingleResponseSchema =
  createJsonApiSingleResponseSchema(notificationPreferencesResourceSchema);

// Create registry and register schemas
export const notificationsRegistry = new OpenAPIRegistry();
notificationsRegistry.register("Notification", notificationSelectSchema);
notificationsRegistry.register(
  "NotificationPreferences",
  notificationPreferencesSelectSchema,
);
notificationsRegistry.register(
  "UpdateNotificationPreferences",
  notificationPreferencesInsertSchema,
);
notificationsRegistry.register(
  "NotificationResource",
  notificationResourceSchema,
);
notificationsRegistry.register(
  "NotificationSingleResponse",
  notificationSingleResponseSchema,
);
notificationsRegistry.register(
  "NotificationsCollectionResponse",
  notificationsCollectionResponseSchema,
);
notificationsRegistry.register(
  "NotificationPreferencesSingleResponse",
  notificationPreferencesSingleResponseSchema,
);

// 1. GET /v1/notifications (Get All Notifications)
notificationsRegistry.registerPath({
  method: "get",
  path: "/v1/notifications",
  summary: "Get current user's notifications",
  description:
    "Returns a paginated list of notifications for the authenticated user",
  tags: ["Notifications v1"],
  security: [{ bearerAuth: [] }],
  responses: {
    [HttpStatus.SUCCESS.statusCode]: {
      description: HttpStatus.SUCCESS.description,
      content: {
        "application/json": {
          schema: notificationsCollectionResponseSchema,
        },
      },
    },
    [HttpStatus.UNAUTHORIZED.statusCode]: {
      description: HttpStatus.UNAUTHORIZED.description,
      content: {
        "application/json": {
          schema: ErrorResponseRef,
        },
      },
    },
    [HttpStatus.INTERNAL_SERVER_ERROR.statusCode]: {
      description: HttpStatus.INTERNAL_SERVER_ERROR.description,
      content: {
        "application/json": {
          schema: ErrorResponseRef,
        },
      },
    },
  },
});

// 2. GET /v1/notifications/preferences (Get Notification Preferences)
notificationsRegistry.registerPath({
  method: "get",
  path: "/v1/notifications/preferences",
  summary: "Get user's notification preferences",
  description: "Retrieve notification preferences for the authenticated user",
  tags: ["Notifications v1"],
  security: [{ bearerAuth: [] }],
  responses: {
    [HttpStatus.SUCCESS.statusCode]: {
      description: HttpStatus.SUCCESS.description,
      content: {
        "application/json": {
          schema: notificationPreferencesSingleResponseSchema,
        },
      },
    },
    [HttpStatus.UNAUTHORIZED.statusCode]: {
      description: HttpStatus.UNAUTHORIZED.description,
      content: {
        "application/json": {
          schema: ErrorResponseRef,
        },
      },
    },
    [HttpStatus.NOT_FOUND.statusCode]: {
      description: HttpStatus.NOT_FOUND.description,
      content: {
        "application/json": {
          schema: ErrorResponseRef,
        },
      },
    },
  },
});

// 3. POST /v1/notifications/set (Set Initial Notification Preferences)
notificationsRegistry.registerPath({
  method: "post",
  path: "/v1/notifications/set",
  summary: "Set initial notification preferences",
  description:
    "Create default notification preferences for the authenticated user",
  tags: ["Notifications v1"],
  security: [{ bearerAuth: [] }],
  responses: {
    [HttpStatus.SUCCESS.statusCode]: {
      description: HttpStatus.SUCCESS.description,
      content: {
        "application/json": {
          schema: notificationPreferencesSingleResponseSchema,
        },
      },
    },
    [HttpStatus.UNAUTHORIZED.statusCode]: {
      description: HttpStatus.UNAUTHORIZED.description,
      content: {
        "application/json": {
          schema: ErrorResponseRef,
        },
      },
    },
    [HttpStatus.NOT_FOUND.statusCode]: {
      description: HttpStatus.NOT_FOUND.description,
      content: {
        "application/json": {
          schema: ErrorResponseRef,
        },
      },
    },
  },
});

// 4. PUT /v1/notifications/preferences/update (Update Notification Preferences)
notificationsRegistry.registerPath({
  method: "put",
  path: "/v1/notifications/preferences/update",
  summary: "Update notification preferences",
  description: "Update notification preferences for the authenticated user",
  tags: ["Notifications v1"],
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      required: true,
      content: {
        "application/json": {
          schema: notificationPreferencesInsertSchema,
        },
      },
    },
  },
  responses: {
    [HttpStatus.SUCCESS.statusCode]: {
      description: HttpStatus.SUCCESS.description,
      content: {
        "application/json": {
          schema: notificationPreferencesSingleResponseSchema,
        },
      },
    },
    [HttpStatus.UNAUTHORIZED.statusCode]: {
      description: HttpStatus.UNAUTHORIZED.description,
      content: {
        "application/json": {
          schema: ErrorResponseRef,
        },
      },
    },
    [HttpStatus.BAD_REQUEST.statusCode]: {
      description: HttpStatus.BAD_REQUEST.description,
      content: {
        "application/json": {
          schema: ErrorResponseRef,
        },
      },
    },
    [HttpStatus.NOT_FOUND.statusCode]: {
      description: HttpStatus.NOT_FOUND.description,
      content: {
        "application/json": {
          schema: ErrorResponseRef,
        },
      },
    },
  },
});
