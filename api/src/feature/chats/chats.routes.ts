import { Router } from "express";
import { z } from "zod";

import {
  HttpLocation,
  validateHttpRequest,
} from "@/middleware/request-validators";
import type { ApiManifest } from "@/routes/api.types";

import { createChatController } from "./controllers/create-chat.controller";
import { deleteChatController } from "./controllers/delete-chat.controller";
import { getChatController } from "./controllers/get-chat.controller";
import { getUserChatsController } from "./controllers/get-user-chats.controller";

const chatRouter = Router();

// Define create chat request schema locally if not imported
const createChatRequestSchema = z.object({
  message: z.string().min(1).max(10000),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

chatRouter.post(
  "/",
  validateHttpRequest(createChatRequestSchema, HttpLocation.Body),
  createChatController,
);
chatRouter.get("/", getUserChatsController);
chatRouter.get(
  "/:chatId",
  validateHttpRequest(z.object({ chatId: z.string() }), HttpLocation.Params),
  getChatController,
);
chatRouter.delete(
  "/:chatId",
  validateHttpRequest(z.object({ chatId: z.string() }), HttpLocation.Params),
  deleteChatController,
);

export const chatsApi: ApiManifest = {
  path: "/v1/chats",
  router: chatRouter,
};

export default chatRouter;
