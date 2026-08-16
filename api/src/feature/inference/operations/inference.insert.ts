import { db } from "@/lib/drizzle";
import { userInferencePreferencesSchema } from "../inference.schema";
import { toResult } from "@/lib/drizzle/drizzle.utils";
import type { DbResult } from "@/lib/drizzle/drizzle.types";
import type {
  InferencePreference,
  NewInferencePreference,
} from "../inference.types";

export const upsertUserPreference = async (
  data: NewInferencePreference,
): Promise<DbResult<InferencePreference>> => {
  const { userId, strategyKey, providerId, modelId } = data;
  const [result] = await db
    .insert(userInferencePreferencesSchema)
    .values({
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
