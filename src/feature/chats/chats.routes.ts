import { Router } from "express";
import { createChatController } from "./controllers/create-chat.controller";
import { getUserChatsController } from "./controllers/get-user-chats.controller";
import { getChatController } from "./controllers/get-chat.controller";
import { deleteChatController } from "./controllers/delete-chat.controller";

export const CHATS_PATH = "/v1/chats";

const chatRouter = Router();

chatRouter.post("/", createChatController);
chatRouter.get("/", getUserChatsController);
chatRouter.get("/:chatId", getChatController);
chatRouter.delete("/:chatId", deleteChatController);

export default chatRouter;
