import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { HttpStatus } from "@/lib/http/http.status";
import {
  defineApiResource,
  registerJsonApiSchemas,
  registerRoutes,
} from "@/lib/openapi/openapi.core";
import type { PathDefinition } from "@/lib/openapi/openapi.types";

import { chatsApi } from "./chats.routes";
import { chatSelectSchema } from "./chats.types";

export const chatsRegistry = new OpenAPIRegistry();

// Define create chat request schema
const createChatRequestSchema = z.object({
  message: z.string().min(1).max(10000),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

const chatApiResource = defineApiResource({
  select: chatSelectSchema,
  insert: createChatRequestSchema,
  update: createChatRequestSchema.partial(),
});

export const ChatApiSchemas = registerJsonApiSchemas({
  registry: chatsRegistry,
  resourceType: "chat",
  pascalName: "Chat",
  schemas: chatApiResource,
});

const chatPaths: PathDefinition[] = [
  {
    handlerName: "createChatController",
    method: "post",
    path: chatsApi.path,
    summary: "Create a new chat",
    description: "Creates a new chat session with an optional initial message",
    security: [{ bearerAuth: [] }],
    requestBodySchema: createChatRequestSchema,
    successStatus: HttpStatus.CREATED,
    successSchema: ChatApiSchemas.singleResSchema,
    errorCodes: [400, 401, 500],
  },
  {
    handlerName: "getAllChatsController",
    method: "get",
    path: chatsApi.path,
    summary: "Get user's chats",
    description: "Returns a list of chats for the authenticated user",
    security: [{ bearerAuth: [] }],
    successStatus: HttpStatus.SUCCESS,
    successSchema: ChatApiSchemas.colResSchema,
    errorCodes: [401, 500],
  },
  {
    handlerName: "getChatByIdController",
    method: "get",
    path: `${chatsApi.path}/{chatId}`,
    summary: "Get chat by ID",
    description: "Returns a specific chat by its ID",
    security: [{ bearerAuth: [] }],
    successStatus: HttpStatus.SUCCESS,
    successSchema: ChatApiSchemas.singleResSchema,
    errorCodes: [401, 404, 500],
  },
];

registerRoutes({
  registry: chatsRegistry,
  defaultTag: "Chats v1",
  routes: chatPaths,
});

chatsRegistry.register("Chat", chatSelectSchema);
chatsRegistry.register("CreateChatRequest", createChatRequestSchema);
