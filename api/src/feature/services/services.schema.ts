import {
  pgTable,
  uuid,
  text,
  timestamp,
  primaryKey,
} from "drizzle-orm/pg-core";

export const serviceCategoriesSchema = pgTable("service_categories", {
  id: text("id").primaryKey(),
  label: text("label").notNull(),
  icon: text("icon").notNull(),
});

export const institutionsSchema = pgTable("institutions", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  location: text("location").notNull(),
  contact: text("contact"),
  website: text("website"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const servicesSchema = pgTable("services", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  categoryId: text("category_id").references(() => serviceCategoriesSchema.id),
  slug: text("slug").unique().notNull(),
  description: text("description"),
});

export const institutionsToServices = pgTable(
  "institutions_to_services",
  {
    institutionId: uuid("institution_id").references(
      () => institutionsSchema.id,
    ),
    serviceId: uuid("service_id").references(() => servicesSchema.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.institutionId, t.serviceId] }),
  }),
);

export const combinedServiceSchema = {
  serviceCategoriesSchema,
  institutionsSchema,
  servicesSchema,
  institutionsToServices,
};
