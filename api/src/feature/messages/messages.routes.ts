import { Router } from "express";
import { sendMessageController } from "./controllers/create-messages.controler";
import { getMessagesByChatIdController } from "./controllers/get-messages.controller";

export const MESSAGES_PATH = "/v1/messages";

const messagesRouter = Router();

messagesRouter.post("/", sendMessageController);
messagesRouter.get("/:chatId/all", getMessagesByChatIdController);

export default messagesRouter;
