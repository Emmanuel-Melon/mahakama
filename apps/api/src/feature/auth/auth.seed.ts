import { usersSchema } from "@/feature/users/users.schema";
import { db } from "@/lib/drizzle";
import { logger } from "@/lib/logger";
import { hashPassword } from "./auth.utils";

const specialUsers = [
  {
    email: "admin@mahakama.com",
    firstName: "Emmanuel",
    lastName: "Gatwech",
    role: "admin" as const,
    password: process.env.INITIAL_ADMIN_PASSWORD || "ChangeMe123!",
  },
  {
    email: "lawyer.gatwech@mahakama.com",
    firstName: "Emmanuel",
    lastName: "Gatwech",
    role: "lawyer" as const,
    password: process.env.INITIAL_LAWYER_PASSWORD || "ChangeMe123!",
  },
  {
    email: "user.gatwech@mahakama.com",
    firstName: "Emmanuel",
    lastName: "Gatwech",
    role: "user" as const,
    password: process.env.INITIAL_USER_PASSWORD || "ChangeMe123!",
  },
];

export async function seedAuthSystem() {
  try {
    logger.info("Starting Auth System Seeding...");

    const now = new Date();

    for (const userData of specialUsers) {
      const hashedPassword = await hashPassword(userData.password);

      await db
        .insert(usersSchema)
        .values({
          email: userData.email.toLowerCase().trim(),
          name: `${userData.firstName} ${userData.lastName}`,
          role: userData.role,
          password: hashedPassword,
          isOnboarded: true,
          isFirstLogin: false,
          emailVerifiedAt: now,
        })
        .onConflictDoUpdate({
          target: usersSchema.email,
          set: {
            role: userData.role,
            emailVerifiedAt: now,
            updatedAt: now,
          },
        });
      logger.info(`Successfully processed special user: ${userData.email}`);
    }

    logger.info("✅ Auth System seeding completed successfully");
  } catch (error) {
    logger.error({ error }, "Error in Auth System seeding");
    throw error;
  }
}
