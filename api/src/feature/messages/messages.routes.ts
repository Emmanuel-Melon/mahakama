import { Router } from "express";
import { sendMessageController } from "./controllers/create-messages.controler";
import { getMessagesByChatIdController } from "./controllers/get-messages.controller";
import { retryMessageController } from "./controllers/retry-message.controller";

export const MESSAGES_PATH = "/v1/messages";

const messagesRouter = Router();

messagesRouter.post("/", sendMessageController);
messagesRouter.get("/:chatId/all", getMessagesByChatIdController);
messagesRouter.post("/:messageId/retry", retryMessageController);

export default messagesRouter;
