import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { usersSchema } from "@/feature/users/users.schema";

export const secureTokenTypeEnum = pgEnum("secure_token_type", [
  "CODE",
  "LINK",
]);

export const secureTokenEventTypeEnum = pgEnum("secure_token_event_type", [
  "VIEWED",
  "VALIDATED",
  "CONSUMED",
  "REVOKED",
  "EXPIRED_ATTEMPT",
  "INVALID_ATTEMPT",
]);

export const secureTokensSchema = pgTable(
  "secure_tokens",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tokenHash: varchar("token_hash", { length: 255 }).notNull(),
    tokenType: secureTokenTypeEnum("token_type").notNull(),

    // Optional direct user reference for user-bound tokens (e.g. auth links, password resets)
    userId: uuid("user_id").references(() => usersSchema.id, {
      onDelete: "cascade",
    }),

    // Hybrid polymorphic entity tracking (e.g. entityType: "voucher", entityId: "uuid-or-string")
    entityType: varchar("entity_type", { length: 50 }).notNull(),
    entityId: varchar("entity_id", { length: 255 }).notNull(),

    // Multi-use support (undefined maxUses = domain-managed balance/state)
    maxUses: integer("max_uses"),
    usesCount: integer("uses_count").default(0).notNull(),

    metadata: jsonb("metadata").$type<Record<string, unknown>>(),

    expiresAt: timestamp("expires_at").notNull(),
    usedAt: timestamp("used_at"),
    revokedAt: timestamp("revoked_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    tokenHashIdx: uniqueIndex("secure_token_hash_idx").on(table.tokenHash),
    userTypeIdx: index("secure_token_user_type_idx").on(
      table.userId,
      table.tokenType,
    ),
    entityTypeIdx: index("secure_token_entity_type_idx").on(
      table.entityType,
      table.entityId,
      table.tokenType,
    ),
  }),
);

export const secureTokenEventsSchema = pgTable(
  "secure_token_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tokenId: uuid("token_id").references(() => secureTokensSchema.id, {
      onDelete: "cascade",
    }),

    eventType: secureTokenEventTypeEnum("event_type").notNull(),
    ipAddress: varchar("ip_address", { length: 45 }),
    userAgent: varchar("user_agent", { length: 255 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    tokenIdx: index("secure_token_events_token_idx").on(
      table.tokenId,
      table.createdAt,
    ),
    ipTimeIdx: index("secure_token_events_ip_time_idx").on(
      table.ipAddress,
      table.createdAt,
    ),
  }),
);

export const combinedAccessSchema = {
  secureTokensSchema,
  secureTokenEventsSchema,
};
