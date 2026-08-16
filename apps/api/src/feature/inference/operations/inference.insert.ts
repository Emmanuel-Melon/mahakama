import { db } from "@/lib/drizzle";
import { userInferencePreferencesSchema } from "../inference.schema";
import {
  executeSingle,
  type DbResult,
} from "@/lib/drizzle/results/results.single";
import type {
  InferencePreference,
  NewInferencePreference,
} from "../inference.types";

export const upsertUserPreference = async (
  data: NewInferencePreference,
): Promise<DbResult<InferencePreference>> => {
  const { userId, strategyKey, providerId, modelId } = data;

  return executeSingle(
    db
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
      .returning()
      .then(([result]) => result),
  );
};
