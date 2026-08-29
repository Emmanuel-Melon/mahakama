import "dotenv/config";
import { faker } from "@faker-js/faker";
import { and, eq, inArray } from "drizzle-orm";
import { db } from "@/lib/drizzle";
import { lawyersTable } from "@/feature/lawyers/lawyers.schema";
import { usersSchema } from "@/feature/users/users.schema";
import { hashPassword } from "@/feature/auth/auth.utils";
import { createMockLawyer } from "./lawyers.factory";
import { logger } from "@/lib/logger";
import type { NewLawyer } from "@/feature/lawyers/lawyers.types";
const NUMBER_OF_LAWYERS = 5;

export async function seedLawyers() {
  try {
    await db.delete(lawyersTable);

    // Create mock lawyers and convert to NewLawyer format (without id, createdAt, updatedAt)
    const mockLawyers = Array.from({ length: NUMBER_OF_LAWYERS }, () =>
      createMockLawyer(),
    );
    const lawyers: NewLawyer[] = mockLawyers.map(
      ({ id, createdAt, updatedAt, ...lawyer }) => lawyer,
    );

    // Each lawyer belongs to a distinct user, so upsert a dedicated lawyer
    // user per lawyer and resolve the real user ids to satisfy the FK.
    const now = new Date();
    const emails = Array.from({ length: NUMBER_OF_LAWYERS }, () =>
      faker.internet.email(),
    );
    const password = await hashPassword(
      process.env.INITIAL_LAWYER_PASSWORD || "ChangeMe123!",
    );

    for (const email of emails) {
      await db
        .insert(usersSchema)
        .values({
          email: email.toLowerCase().trim(),
          name: faker.person.fullName(),
          role: "lawyer",
          password,
          isOnboarded: true,
          isFirstLogin: false,
          emailVerifiedAt: now,
        })
        .onConflictDoUpdate({
          target: usersSchema.email,
          set: {
            role: "lawyer",
            isOnboarded: true,
            emailVerifiedAt: now,
            updatedAt: now,
          },
        });
    }

    const createdUsers = await db
      .select({ id: usersSchema.id, email: usersSchema.email })
      .from(usersSchema)
      .where(
        and(
          eq(usersSchema.role, "lawyer"),
          inArray(
            usersSchema.email,
            emails.map((e) => e.toLowerCase().trim()),
          ),
        ),
      );

    const userIdByEmail = new Map(createdUsers.map((u) => [u.email, u.id]));

    for (let i = 0; i < lawyers.length; i++) {
      const email = emails[i].toLowerCase().trim();
      const userId = userIdByEmail.get(email);
      if (userId) {
        lawyers[i].userId = userId;
      }
    }

    const specializationCounts = lawyers.reduce<Record<string, number>>(
      (acc, lawyer) => {
        const spec = lawyer.specialization;
        acc[spec] = (acc[spec] || 0) + 1;
        return acc;
      },
      {},
    );
    const availableCount = lawyers.filter((l) => l.isAvailable).length;

    // Filter out optional fields that NewLawyer type doesn't expect
    const lawyersToInsert: NewLawyer[] = lawyers.map((lawyer) => {
      const { id, createdAt, updatedAt, casesHandled, ...newLawyer } = lawyer;
      return newLawyer;
    });

    const insertedLawyers = await db
      .insert(lawyersTable)
      .values(lawyersToInsert)
      .returning();
    logger.info(`Successfully seeded ${insertedLawyers.length} lawyers`);
    logger.info(
      {
        insertedLawyers,
        availableCount,
        specializationCounts,
      },
      "Seeded lawyers",
    );
  } catch (error) {
    logger.error({ error }, "Error seeding lawyers");
    process.exit(1);
  }
}
