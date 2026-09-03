import "dotenv/config";
import { inArray } from "drizzle-orm";
import { db } from "@/lib/drizzle";
import { logger } from "@/lib/logger";
import { orgMembersTable, orgsTable } from "./orgs.schema";
import { usersSchema } from "@/feature/users/users.schema";

const SPECIAL_EMAILS = [
  "admin@mahakama.com",
  "lawyer.gatwech@mahakama.com",
  "user.gatwech@mahakama.com",
];

export async function seedOrgs() {
  try {
    logger.info("Starting Org Seeding...");

    await db.delete(orgMembersTable);
    await db.delete(orgsTable);

    const createdUsers = await db
      .select({ id: usersSchema.id, email: usersSchema.email })
      .from(usersSchema)
      .where(inArray(usersSchema.email, SPECIAL_EMAILS));

    const userIdByEmail = new Map(createdUsers.map((u) => [u.email, u.id]));
    const adminId = userIdByEmail.get("admin@mahakama.com");
    const lawyerId = userIdByEmail.get("lawyer.gatwech@mahakama.com");
    const regularUserId = userIdByEmail.get("user.gatwech@mahakama.com");

    if (!adminId || !lawyerId || !regularUserId) {
      throw new Error(
        "Could not resolve all special users for org seeding. Run the auth seed first.",
      );
    }

    const now = new Date();

    const firmOrg = await db
      .insert(orgsTable)
      .values({
        name: "Gatwech & Associates",
        slug: "gatwech-associates",
        createdByUserId: adminId,
      })
      .returning();

    const clientOrg = await db
      .insert(orgsTable)
      .values({
        name: "Gatwech Holdings",
        slug: "gatwech-holdings",
        createdByUserId: adminId,
      })
      .returning();

    const firmOrgId = firmOrg[0].id;
    const clientOrgId = clientOrg[0].id;

    await db.insert(orgMembersTable).values([
      {
        orgId: firmOrgId,
        userId: adminId,
        role: "owner",
        status: "active",
        invitedAt: now,
        joinedAt: now,
      },
      {
        orgId: firmOrgId,
        userId: lawyerId,
        role: "admin",
        status: "active",
        invitedAt: now,
        joinedAt: now,
      },
      {
        orgId: firmOrgId,
        userId: regularUserId,
        role: "member",
        status: "active",
        invitedAt: now,
        joinedAt: now,
      },
      {
        orgId: clientOrgId,
        userId: adminId,
        role: "owner",
        status: "active",
        invitedAt: now,
        joinedAt: now,
      },
      {
        orgId: clientOrgId,
        userId: regularUserId,
        role: "member",
        status: "active",
        invitedAt: now,
        joinedAt: now,
      },
    ]);

    logger.info(
      {
        firmOrgId,
        clientOrgId,
        members: 5,
      },
      "Seeded orgs and members",
    );
    logger.info("✅ Org seeding completed successfully");
  } catch (error) {
    logger.error({ error }, "Error seeding orgs");
    process.exit(1);
  }
}
