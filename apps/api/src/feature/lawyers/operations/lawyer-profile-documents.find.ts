import { db } from "@/lib/drizzle";
import { lawyerProfileDocumentsTable } from "../lawyers.schema";
import { eq } from "drizzle-orm";
import type { LawyerProfileDocument } from "../lawyers.types";
import { toManyResult } from "@/lib/drizzle/drizzle.utils";
import { DbManyResult } from "@/lib/drizzle/drizzle.types";

export async function findLawyerProfileDocuments(
  lawyerProfileId: string,
): Promise<DbManyResult<LawyerProfileDocument>> {
  const docs = await db.query.lawyerProfileDocuments.findMany({
    where: eq(lawyerProfileDocumentsTable.lawyerProfileId, lawyerProfileId),
  });

  return toManyResult(docs);
}
