import { Router } from "express";
import { authenticateToken, methodBasedAuth } from "@/middleware/auth";
import { authRouter } from "@/service/auth/auth.routes";
import chatRouter, { CHATS_PATH } from "@/feature/chats/chats.routes";
import documentRoutes, {
  DOCUMENTS_PATH,
} from "@/feature/documents/documents.routes";
import lawyerRoutes, { LAWYERS_PATH } from "@/feature/lawyers/lawyer.routes";
import messagesRoutes, {
  MESSAGES_PATH,
} from "@/feature/messages/messages.routes";
import notificationsRoutes, {
  NOTIFICATIONS_PATH,
} from "@/service/notifications/notifications.routes";
import {
  servicesRouter,
  SERVICES_PATH,
} from "@/feature/services/services.routes";
import userRoutes, { USERS_PATH } from "@/feature/users/users.routes";

export const AUTH_PATH = "/v1";
const BASE_PATH = "/api/v1";
const mahakamaRouter = Router();

// PRIVATE ROUTES
mahakamaRouter.use(USERS_PATH, authenticateToken, userRoutes);
mahakamaRouter.use(CHATS_PATH, authenticateToken, chatRouter);
mahakamaRouter.use(DOCUMENTS_PATH, authenticateToken, documentRoutes);
mahakamaRouter.use(LAWYERS_PATH, authenticateToken, lawyerRoutes);
mahakamaRouter.use(MESSAGES_PATH, authenticateToken, messagesRoutes);
mahakamaRouter.use(NOTIFICATIONS_PATH, authenticateToken, notificationsRoutes);
mahakamaRouter.use(SERVICES_PATH, authenticateToken, servicesRouter);

// PUBLIC ROUTES
mahakamaRouter.use(AUTH_PATH, methodBasedAuth, authRouter);

export default mahakamaRouter;

export const availableRoutes = [
  `${BASE_PATH}${AUTH_PATH}`,
  `${BASE_PATH}${CHATS_PATH}`,
  `${BASE_PATH}${DOCUMENTS_PATH}`,
  `${BASE_PATH}${LAWYERS_PATH}`,
  `${BASE_PATH}${MESSAGES_PATH}`,
  `${BASE_PATH}${NOTIFICATIONS_PATH}`,
  `${BASE_PATH}${SERVICES_PATH}`,
  `${BASE_PATH}${USERS_PATH}`,
] as const;
