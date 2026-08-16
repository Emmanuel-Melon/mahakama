import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { HttpStatus } from "@/lib/http/http.status";
import {
  defineApiResource,
  registerJsonApiSchemas,
  registerRoutes,
} from "@/lib/openapi/openapi.core";
import type { PathDefinition } from "@/lib/openapi/openapi.types";

import { messagesApi } from "./messages.routes";
import { chatSelectSchema, messageInputSchema } from "./messages.types";

export const messagesRegistry = new OpenAPIRegistry();

// Define message sender schema for API documentation
const messageSenderSchema = z.object({
  id: z.string(),
  displayName: z.string().optional(),
});

const messageApiResource = defineApiResource({
  select: chatSelectSchema,
  insert: messageInputSchema,
  update: messageInputSchema.partial(),
});

export const MessageApiSchemas = registerJsonApiSchemas({
  registry: messagesRegistry,
  resourceType: "message",
  pascalName: "Message",
  schemas: messageApiResource,
});

const messagePaths: PathDefinition[] = [
  {
    handlerName: "createMessageController",
    method: "post",
    path: messagesApi.path,
    summary: "Send a message",
    description: "Send a new message to a chat",
    security: [{ bearerAuth: [] }],
    requestBodySchema: messageInputSchema,
    successStatus: HttpStatus.CREATED,
    successSchema: MessageApiSchemas.singleResSchema,
    errorCodes: [400, 401, 404, 500],
  },
  {
    handlerName: "getMessagesByChatIdController",
    method: "get",
    path: `${messagesApi.path}/{chatId}/all`,
    summary: "Get messages by chat ID",
    description: "Retrieve all messages for a specific chat",
    security: [{ bearerAuth: [] }],
    successStatus: HttpStatus.SUCCESS,
    successSchema: MessageApiSchemas.colResSchema,
    errorCodes: [401, 404, 500],
  },
  {
    handlerName: "retryMessageController",
    method: "post",
    path: `${messagesApi.path}/{messageId}/retry`,
    summary: "Retry a failed assistant reply",
    description:
      "Reset the reply status to pending and re-enqueue the reply job for a user message",
    security: [{ bearerAuth: [] }],
    successStatus: HttpStatus.SUCCESS,
    successSchema: MessageApiSchemas.singleResSchema,
    errorCodes: [400, 401, 404, 500],
  },
];

registerRoutes({
  registry: messagesRegistry,
  defaultTag: "Messages v1",
  routes: messagePaths,
});

messagesRegistry.register("Message", chatSelectSchema);
messagesRegistry.register("MessageSender", messageSenderSchema);
messagesRegistry.register("SendMessageRequest", messageInputSchema);
messagesRegistry.register("MessageInput", messageInputSchema);
