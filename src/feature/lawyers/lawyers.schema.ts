import {
  pgTable,
  varchar,
  integer,
  boolean,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const lawyersTable = pgTable("lawyers", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  specialization: varchar("specialization", { length: 100 }).notNull(),
  experienceYears: integer("experience_years").notNull(),
  rating: varchar("rating", { length: 10 }),
  casesHandled: integer("cases_handled").default(0).notNull(),
  isAvailable: boolean("is_available").default(true).notNull(),
  location: varchar("location", { length: 100 }).notNull(),
  languages: text("languages").array().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const combinedLawyersSchema = {
  lawyers: lawyersTable,
};
