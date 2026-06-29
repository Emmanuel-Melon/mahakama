import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  boolean,
  unique,
} from "drizzle-orm/pg-core";
import { usersSchema } from "@/feature/users/users.schema";

export const inferenceProvidersSchema = pgTable("inference_providers", {
  id: varchar("id", { length: 32 }).primaryKey(), // 'gemini', 'ollama'
  name: varchar("name", { length: 64 }).notNull(), // 'Google Gemini', 'Local Ollama'
  isExternal: boolean("is_external").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const inferenceModelsSchema = pgTable("inference_models", {
  id: varchar("id", { length: 64 }).primaryKey(), // 'gemini-2.5-flash'
  providerId: varchar("provider_id", { length: 32 })
    .notNull()
    .references(() => inferenceProvidersSchema.id),
  displayName: varchar("display_name", { length: 64 }).notNull(),
  isPremium: boolean("is_premium").default(false),
  isActive: boolean("is_active").default(true),
});

export const userInferencePreferencesSchema = pgTable(
  "user_inference_preferences",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => usersSchema.id),
    strategyKey: varchar("strategy_key", { length: 64 }).notNull(),
    providerId: varchar("provider_id", { length: 32 })
      .notNull()
      .references(() => inferenceProvidersSchema.id),
    modelId: varchar("model_id", { length: 64 })
      .notNull()
      .references(() => inferenceModelsSchema.id),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    uniqueUserStrategy: unique("unique_user_strategy").on(
      table.userId,
      table.strategyKey,
    ),
  }),
);

export const combinedInferenceSchema = {
  userInferencePreferencesSchema,
  inferenceProvidersSchema,
  inferenceModelsSchema,
};
