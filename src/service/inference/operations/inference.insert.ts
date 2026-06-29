import { db } from "@/lib/drizzle";
import { userInferencePreferencesSchema } from "../inference.schema";
import { toResult } from "@/lib/drizzle/drizzle.utils";
import type { DbResult } from "@/lib/drizzle/drizzle.types";
import type { InferencePreference } from "../inference.types";
import { v4 as uuid } from "uuid";

export const upsertUserPreference = async (
  userId: string,
  strategyKey: string,
  providerId: string,
  modelId: string,
): Promise<DbResult<InferencePreference>> => {
  const [result] = await db
    .insert(userInferencePreferencesSchema)
    .values({
      id: uuid(),
      userId,
      strategyKey,
      providerId,
      modelId,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: [
        userInferencePreferencesSchema.userId,
        userInferencePreferencesSchema.strategyKey,
      ],
      set: {
        providerId,
        modelId,
        updatedAt: new Date(),
      },
    })
    .returning();

  return toResult(result);
};
