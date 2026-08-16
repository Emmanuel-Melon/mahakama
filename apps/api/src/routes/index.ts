import { Router } from "express";
import { authenticateToken, methodBasedAuth } from "@/middleware/auth";
import { authRouter } from "@/feature/auth/auth.routes";
import { chatsApi } from "@/feature/chats/chats.routes";
import { documentsApi } from "@/feature/documents/documents.routes";
import { lawyersApi } from "@/feature/lawyers/lawyer.routes";
import { messagesApi } from "@/feature/messages/messages.routes";
import { notificationsApi } from "@/feature/notifications/notifications.routes";
import { servicesApi } from "@/feature/services/services.routes";
import { usersApi } from "@/feature/users/users.routes";

export const AUTH_PATH = "/v1";
const BASE_PATH = "/api/v1";
const mahakamaRouter = Router();

// PRIVATE ROUTES
mahakamaRouter.use(usersApi.path, authenticateToken, usersApi.router);
mahakamaRouter.use(chatsApi.path, authenticateToken, chatsApi.router);
mahakamaRouter.use(documentsApi.path, authenticateToken, documentsApi.router);
mahakamaRouter.use(lawyersApi.path, authenticateToken, lawyersApi.router);
mahakamaRouter.use(messagesApi.path, authenticateToken, messagesApi.router);
mahakamaRouter.use(
  notificationsApi.path,
  authenticateToken,
  notificationsApi.router,
);
mahakamaRouter.use(servicesApi.path, authenticateToken, servicesApi.router);

// PUBLIC ROUTES
mahakamaRouter.use(AUTH_PATH, methodBasedAuth, authRouter);

export default mahakamaRouter;
