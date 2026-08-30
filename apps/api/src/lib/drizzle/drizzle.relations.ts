import { relations } from "drizzle-orm";
import { usersSchema } from "@/feature/users/users.schema";
import { chatsSchema } from "@/feature/chats/chats.schema";
import {
  documentsTable,
  bookmarksTable,
  downloadsTable,
} from "@/feature/corpus/corpus.schema";
import { chatMessages } from "@/feature/messages/messages.schema";
import { notificationsSchema } from "@/feature/notifications/notifications.schema";
import {
  institutionsSchema,
  servicesSchema,
  institutionsToServices,
  serviceCategoriesSchema,
} from "@/feature/services/services.schema";
import {
  inferenceProvidersSchema,
  inferenceModelsSchema,
  userInferencePreferencesSchema,
} from "@/feature/inference/inference.schema";
import {
  mattersTable,
  matterLawyersTable,
  matterNotesTable,
  matterDocumentsTable,
  matterStatusHistoryTable,
  matterEventsTable,
  matterActivitiesTable,
} from "@/feature/matter/matter.schema";

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

// Corpus Relations
export const corpusRelations = relations(documentsTable, ({ many }) => ({
  bookmarks: many(bookmarksTable),
  downloads: many(downloadsTable),
}));

export const bookmarksRelations = relations(bookmarksTable, ({ one }) => ({
  user: one(usersSchema, {
    fields: [bookmarksTable.user_id],
    references: [usersSchema.id],
  }),
  corpus: one(documentsTable, {
    fields: [bookmarksTable.documentId],
    references: [documentsTable.id],
  }),
}));

export const downloadsRelations = relations(downloadsTable, ({ one }) => ({
  user: one(usersSchema, {
    fields: [downloadsTable.user_id],
    references: [usersSchema.id],
  }),
  corpus: one(documentsTable, {
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

// Inference Relations
export const inferenceProvidersRelations = relations(
  inferenceProvidersSchema,
  ({ many }) => ({
    models: many(inferenceModelsSchema),
  }),
);

export const inferenceModelsRelations = relations(
  inferenceModelsSchema,
  ({ one }) => ({
    provider: one(inferenceProvidersSchema, {
      fields: [inferenceModelsSchema.providerId],
      references: [inferenceProvidersSchema.id],
    }),
  }),
);

export const userInferencePreferencesRelations = relations(
  userInferencePreferencesSchema,
  ({ one }) => ({
    user: one(usersSchema, {
      fields: [userInferencePreferencesSchema.userId],
      references: [usersSchema.id],
    }),
    provider: one(inferenceProvidersSchema, {
      fields: [userInferencePreferencesSchema.providerId],
      references: [inferenceProvidersSchema.id],
    }),
    model: one(inferenceModelsSchema, {
      fields: [userInferencePreferencesSchema.modelId],
      references: [inferenceModelsSchema.id],
    }),
  }),
);

// Matter Relations
export const mattersRelations = relations(mattersTable, ({ many }) => ({
  lawyers: many(matterLawyersTable),
  notes: many(matterNotesTable),
  documents: many(matterDocumentsTable),
  statusHistory: many(matterStatusHistoryTable),
  events: many(matterEventsTable),
  activities: many(matterActivitiesTable),
}));

export const matterLawyersRelations = relations(
  matterLawyersTable,
  ({ one }) => ({
    matter: one(mattersTable, {
      fields: [matterLawyersTable.matterId],
      references: [mattersTable.id],
    }),
  }),
);

export const matterNotesRelations = relations(matterNotesTable, ({ one }) => ({
  matter: one(mattersTable, {
    fields: [matterNotesTable.matterId],
    references: [mattersTable.id],
  }),
}));

export const matterDocumentsRelations = relations(
  matterDocumentsTable,
  ({ one }) => ({
    matter: one(mattersTable, {
      fields: [matterDocumentsTable.matterId],
      references: [mattersTable.id],
    }),
  }),
);

export const matterStatusHistoryRelations = relations(
  matterStatusHistoryTable,
  ({ one }) => ({
    matter: one(mattersTable, {
      fields: [matterStatusHistoryTable.matterId],
      references: [mattersTable.id],
    }),
  }),
);

export const matterEventsRelations = relations(
  matterEventsTable,
  ({ one }) => ({
    matter: one(mattersTable, {
      fields: [matterEventsTable.matterId],
      references: [mattersTable.id],
    }),
  }),
);

export const matterActivitiesRelations = relations(
  matterActivitiesTable,
  ({ one }) => ({
    matter: one(mattersTable, {
      fields: [matterActivitiesTable.matterId],
      references: [mattersTable.id],
    }),
  }),
);

// Combined Relations Export
export const allRelations = {
  usersRelations,
  chatsRelations,
  corpusRelations,
  bookmarksRelations,
  downloadsRelations,
  chatMessagesRelations,
  notificationsRelations,
  institutionsRelations,
  servicesRelations,
  institutionsToServicesRelations,
  inferenceProvidersRelations,
  inferenceModelsRelations,
  userInferencePreferencesRelations,
  mattersRelations,
  matterLawyersRelations,
  matterNotesRelations,
  matterDocumentsRelations,
  matterStatusHistoryRelations,
  matterEventsRelations,
  matterActivitiesRelations,
};
