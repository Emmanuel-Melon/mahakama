import {
  pgTable,
  varchar,
  text,
  timestamp,
  uuid,
  pgEnum,
} from "drizzle-orm/pg-core";
import { usersSchema } from "@/feature/users/users.schema";
import { lawyersTable } from "@/feature/lawyers/lawyers.schema";

export const consultationStatusEnum = pgEnum("consultation_status", [
  "pending",
  "accepted",
  "declined",
  "engaged",
  "closed",
]);

export const consultationsTable = pgTable("consultations", {
  id: uuid("id").primaryKey().defaultRandom(),

  customerId: uuid("customer_id")
    .notNull()
    .references(() => usersSchema.id),
  lawyerId: uuid("lawyer_id")
    .notNull()
    .references(() => lawyersTable.id),

  status: consultationStatusEnum("status").default("pending").notNull(),

  // customer's initial request context
  requestMessage: text("request_message"),

  // lifecycle timestamps — nullable, set as status transitions happen
  respondedAt: timestamp("responded_at"),
  declineReason: text("decline_reason"),
  engagedAt: timestamp("engaged_at"),
  closedAt: timestamp("closed_at"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const combinedConsultationsSchema = {
  consultations: consultationsTable,
};
