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
    gender: "male" as const,
    age: 34,
    country: "South Sudan",
    city: "Juba",
    phoneNumber: "+211 912 345 678",
    occupation: "Legal Administrator",
    bio: "Platform administrator for Mahakama, overseeing users, lawyers, and firm operations.",
  },
  {
    email: "lawyer.gatwech@mahakama.com",
    firstName: "Emmanuel",
    lastName: "Gatwech",
    role: "lawyer" as const,
    password: process.env.INITIAL_LAWYER_PASSWORD || "ChangeMe123!",
    gender: "male" as const,
    age: 41,
    country: "South Sudan",
    city: "Juba",
    phoneNumber: "+211 923 456 789",
    occupation: "Attorney at Law",
    bio: "Practicing attorney specializing in civil and commercial litigation.",
  },
  {
    email: "user.gatwech@mahakama.com",
    firstName: "Emmanuel",
    lastName: "Gatwech",
    role: "user" as const,
    password: process.env.INITIAL_USER_PASSWORD || "ChangeMe123!",
    gender: "prefer_not_to_say" as const,
    age: 29,
    country: "South Sudan",
    city: "Wau",
    phoneNumber: "+211 934 567 890",
    occupation: "Entrepreneur",
    bio: "Small business owner interested in business law resources.",
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
          gender: userData.gender,
          age: userData.age,
          country: userData.country,
          city: userData.city,
          phoneNumber: userData.phoneNumber,
          occupation: userData.occupation,
          bio: userData.bio,
          isOnboarded: true,
          isFirstLogin: false,
          emailVerifiedAt: now,
        })
        .onConflictDoUpdate({
          target: usersSchema.email,
          set: {
            role: userData.role,
            name: `${userData.firstName} ${userData.lastName}`,
            gender: userData.gender,
            age: userData.age,
            country: userData.country,
            city: userData.city,
            phoneNumber: userData.phoneNumber,
            occupation: userData.occupation,
            bio: userData.bio,
            isOnboarded: true,
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
