// import "dotenv/config";
// import { db } from "@/lib/drizzle";
// import { servicesSchema, institutionsSchema, institutionsToServices, serviceCategoriesSchema } from "@/feature/services/services.schema";
// import { randomUUID } from "crypto";
// import { logger } from "@/lib/logger";
// import { servicesData } from "./services.constants";
// import { institutionsData } from "./institutions.constants";

// export async function seedServices() {
//   try {
//     await db.delete(servicesSchema);
//     await db.delete(institutionsSchema);
//     await db.delete(institutionsToServices);
//     await db.delete(serviceCategoriesSchema);

//     // Seed service categories first
//     const serviceCategories = [
//       { id: "government", label: "Government", icon: "building" },
//       { id: "legal-aid", label: "Legal Aid", icon: "hand-helping" },
//       { id: "dispute-resolution", label: "Dispute Resolution", icon: "balance-scale" },
//       { id: "specialized", label: "Specialized", icon: "users" },
//     ];
//     const insertedCategories = await db
//       .insert(serviceCategoriesSchema)
//       .values(serviceCategories)
//       .returning();

//     // Seed services
//     const servicesWithIds = servicesData.map((service) => ({
//       ...service,
//       id: randomUUID(),
//       slug: `${service.name.toLowerCase().replace(/\s+/g, '-')}-${randomUUID().slice(0, 8)}`,
//       categoryId: service.category,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     }));
//     const insertedServices = await db
//       .insert(servicesSchema)
//       .values(servicesWithIds)
//       .returning();

//     // Seed institutions
//     const institutionsWithIds = institutionsData.map((institution: any) => ({
//       ...institution,
//       id: randomUUID(),
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     }));
//     const insertedInstitutions = await db
//       .insert(institutionsSchema)
//       .values(institutionsWithIds)
//       .returning();

//     // Seed institution-service relationships
//     const institutionServiceRelations = [];
//     for (const service of servicesWithIds) {
//       for (const institution of institutionsWithIds) {
//         institutionServiceRelations.push({
//           institutionId: institution.id,
//           serviceId: service.id,
//         });
//       }
//     }
//     const insertedRelations = await db
//       .insert(institutionsToServices)
//       .values(institutionServiceRelations)
//       .returning();

//     logger.info(`Successfully seeded ${insertedCategories.length} categories, ${insertedServices.length} services and ${insertedInstitutions.length} institutions`);
//     logger.info({
//       categories: insertedCategories,
//       services: insertedServices,
//       institutions: insertedInstitutions,
//       relations: insertedRelations
//     }, "Seeded services data:");
//   } catch (error) {
//     logger.error({ error }, "Error seeding legal services:");
//     process.exit(1);
//   }
// }
