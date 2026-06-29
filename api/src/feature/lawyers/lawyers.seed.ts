// import "dotenv/config";
// import { db } from "@/lib/drizzle";
// import { lawyersTable } from "@/feature/lawyers/lawyers.schema";
// import { createMockLawyer } from "./lawyers.factory";
// import { logger } from "@/lib/logger";
// import type { NewLawyer } from "@/feature/lawyers/lawyers.types";
// const NUMBER_OF_LAWYERS = 5;

// export async function seedLawyers() {
//   try {
//     await db.delete(lawyersTable);

//     // Create mock lawyers and convert to NewLawyer format (without id, createdAt, updatedAt)
//     const mockLawyers = Array.from({ length: NUMBER_OF_LAWYERS }, () =>
//       createMockLawyer(),
//     );
//     const lawyers: NewLawyer[] = mockLawyers.map(
//       ({ id, createdAt, updatedAt, ...lawyer }) => lawyer,
//     );

//     const specializationCounts = lawyers.reduce<Record<string, number>>(
//       (acc, lawyer) => {
//         const spec = lawyer.specialization;
//         acc[spec] = (acc[spec] || 0) + 1;
//         return acc;
//       },
//       {},
//     );
//     const availableCount = lawyers.filter((l) => l.isAvailable).length;

//     // Filter out optional fields that NewLawyer type doesn't expect
//     const lawyersToInsert: NewLawyer[] = lawyers.map((lawyer) => {
//       const { id, createdAt, updatedAt, rating, casesHandled, ...newLawyer } = lawyer;
//       return newLawyer;
//     });

//     const insertedLawyers = await db
//       .insert(lawyersTable)
//       .values(lawyersToInsert)
//       .returning();
//     logger.info(`Successfully seeded ${insertedLawyers.length} lawyers`);
//     logger.info(
//       {
//         insertedLawyers,
//         availableCount,
//         specializationCounts,
//       },
//       "Seeded lawyers",
//     );
//   } catch (error) {
//     logger.error({ error }, "Error seeding lawyers");
//     process.exit(1);
//   }
// }
