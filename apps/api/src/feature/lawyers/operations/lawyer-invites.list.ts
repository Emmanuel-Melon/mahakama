import { db } from "@/lib/drizzle";
import { lawyerInvitesTable } from "../lawyers.schema";
import type { LawyerInvite } from "../lawyers.types";
import { toManyResult } from "@/lib/drizzle/drizzle.utils";
import { DbManyResult } from "@/lib/drizzle/drizzle.types";

export async function findLawyerInvites(): Promise<DbManyResult<LawyerInvite>> {
  const invites = await db.query.lawyerInvites.findMany({
    orderBy: (fields, desc) => [desc(fields.createdAt)],
  });

  return toManyResult(invites);
}
