import { db } from "@/lib/drizzle";
import { eq, inArray } from "drizzle-orm";
import { usersSchema } from "@/feature/users/users.schema";
import { lawyersTable } from "@/feature/lawyers/lawyers.schema";
import {
  mattersTable,
  matterLawyersTable,
} from "@/feature/matter/matter.schema";
import type { Client, ClientFilters } from "../clients.types";
import { toManyResult } from "@/lib/drizzle/drizzle.utils";
import { DbManyResult } from "@/lib/drizzle/drizzle.types";

export const findClients = async (
  query: ClientFilters,
): Promise<DbManyResult<Client>> => {
  const lawyer = await db.query.lawyers.findFirst({
    where: eq(lawyersTable.userId, query.lawyerUserId),
  });

  if (!lawyer) {
    return { data: [], count: 0, isEmpty: true };
  }

  const clientUserIds = await db
    .selectDistinct({ clientUserId: mattersTable.clientUserId })
    .from(matterLawyersTable)
    .innerJoin(mattersTable, eq(matterLawyersTable.matterId, mattersTable.id))
    .where(eq(matterLawyersTable.lawyerId, lawyer.id));

  if (clientUserIds.length === 0) {
    return { data: [], count: 0, isEmpty: true };
  }

  const ids = clientUserIds.map((c) => c.clientUserId);

  const data = await db.query.usersSchema.findMany({
    where: inArray(usersSchema.id, ids),
  });

  return toManyResult(data);
};
