import { Router } from "express";

import { authApi } from "@/feature/auth/auth.routes";
import { chatsApi } from "@/feature/chats/chats.routes";
import { consultationsApi } from "@/feature/consultations/consultations.routes";
import { corpusApi } from "@/feature/corpus/corpus.routes";
import { documentsApi } from "@/feature/documents/documents.routes";
import { lawyersApi } from "@/feature/lawyers/lawyer.routes";
import { matterApi } from "@/feature/matter/matter.routes";
import { messagesApi } from "@/feature/messages/messages.routes";
import { notificationsApi } from "@/feature/notifications/notifications.routes";
import { servicesApi } from "@/feature/services/services.routes";
import { usersApi } from "@/feature/users/users.routes";
import { clientsApi } from "@/feature/clients/clients.routes";
import { useApiRouters } from "@/routes/api.rules";

export const mahakamaRouter = Router();

useApiRouters(mahakamaRouter, [
  authApi,
  chatsApi,
  clientsApi,
  consultationsApi,
  corpusApi,
  documentsApi,
  lawyersApi,
  matterApi,
  messagesApi,
  notificationsApi,
  servicesApi,
  usersApi,
]);

export default mahakamaRouter;
