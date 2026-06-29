import { relations } from "drizzle-orm";
import { usersSchema } from "@/feature/users/users.schema";
import { chatsSchema } from "@/feature/chats/chats.schema";
import {
  documentsTable,
  bookmarksTable,
  downloadsTable,
} from "@/feature/documents/documents.schema";
import { chatMessages } from "@/feature/messages/messages.schema";
import { notificationsSchema } from "@/service/notifications/notifications.schema";
import {
  institutionsSchema,
  servicesSchema,
  institutionsToServices,
  serviceCategoriesSchema,
} from "@/feature/services/services.schema";

// Users Relations
export const usersRelations = relations(usersSchema, ({ many }) => ({
  chats: many(chatsSchema),
}));

// Chats Relations
export const chatsRelations = relations(chatsSchema, ({ one, many }) => ({
  user: one(usersSchema, {
    fields: [chatsSchema.userId],
    references: [usersSchema.id],
  }),
  messages: many(chatMessages),
}));

// Documents Relations
export const documentsRelations = relations(documentsTable, ({ many }) => ({
  bookmarks: many(bookmarksTable),
  downloads: many(downloadsTable),
}));

export const bookmarksRelations = relations(bookmarksTable, ({ one }) => ({
  user: one(usersSchema, {
    fields: [bookmarksTable.user_id],
    references: [usersSchema.id],
  }),
  document: one(documentsTable, {
    fields: [bookmarksTable.documentId],
    references: [documentsTable.id],
  }),
}));

export const downloadsRelations = relations(downloadsTable, ({ one }) => ({
  user: one(usersSchema, {
    fields: [downloadsTable.user_id],
    references: [usersSchema.id],
  }),
  document: one(documentsTable, {
    fields: [downloadsTable.document_id],
    references: [documentsTable.id],
  }),
}));

// Messages Relations
export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  chat: one(chatsSchema, {
    fields: [chatMessages.chatId],
    references: [chatsSchema.id],
  }),
  user: one(usersSchema, {
    fields: [chatMessages.userId],
    references: [usersSchema.id],
  }),
}));

// Notifications Relations
export const notificationsRelations = relations(
  notificationsSchema,
  ({ one }) => ({
    user: one(usersSchema, {
      fields: [notificationsSchema.userId],
      references: [usersSchema.id],
    }),
  }),
);

// Services Relations
export const institutionsRelations = relations(
  institutionsSchema,
  ({ many }) => ({
    services: many(institutionsToServices),
  }),
);

export const servicesRelations = relations(servicesSchema, ({ many }) => ({
  institutions: many(institutionsToServices),
}));

export const institutionsToServicesRelations = relations(
  institutionsToServices,
  ({ one }) => ({
    institution: one(institutionsSchema, {
      fields: [institutionsToServices.institutionId],
      references: [institutionsSchema.id],
    }),
    service: one(servicesSchema, {
      fields: [institutionsToServices.serviceId],
      references: [servicesSchema.id],
    }),
  }),
);

// Combined Relations Export
export const allRelations = {
  usersRelations,
  chatsRelations,
  documentsRelations,
  bookmarksRelations,
  downloadsRelations,
  chatMessagesRelations,
  notificationsRelations,
  institutionsRelations,
  servicesRelations,
  institutionsToServicesRelations,
};
