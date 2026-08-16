import { Router } from "express";
import { z } from "zod";

import {
  HttpLocation,
  validateHttpRequest,
} from "@/middleware/request-validators";
import type { ApiManifest } from "@/routes/api.types";

import { sendMessageController } from "./controllers/create-messages.controller";
import { getMessagesByChatIdController } from "./controllers/get-messages.controller";
import { retryMessageController } from "./controllers/retry-message.controller";
import { messageInputSchema } from "./messages.types";

const messagesRouter = Router();

messagesRouter.post(
  "/",
  validateHttpRequest(messageInputSchema, HttpLocation.Body),
  sendMessageController,
);
messagesRouter.get(
  "/:chatId/all",
  validateHttpRequest(z.object({ chatId: z.string() }), HttpLocation.Params),
  getMessagesByChatIdController,
);
messagesRouter.post(
  "/:messageId/retry",
  validateHttpRequest(z.object({ messageId: z.string() }), HttpLocation.Params),
  retryMessageController,
);

export const messagesApi: ApiManifest = {
  path: "/v1/messages",
  router: messagesRouter,
};

export default messagesRouter;
