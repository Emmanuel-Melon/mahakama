import { db } from "@/lib/drizzle";
import { and, eq } from "drizzle-orm";
import { userInferencePreferencesSchema } from "../inference.schema";
import { findPreference } from "./inference.find";

export const deleteUserPreference = async (
  userId: string,
  strategyKey: string,
): Promise<void> => {
  await db
    .delete(userInferencePreferencesSchema)
    .where(
      and(
        eq(userInferencePreferencesSchema.userId, userId),
        eq(userInferencePreferencesSchema.strategyKey, strategyKey),
      ),
    );
};

export const resolveActiveInference = async (
  userId: string,
  strategyKey: string,
  override?: { providerId?: string; modelId?: string },
) => {
  if (override?.providerId && override?.modelId) {
    return override;
  }

  const pref = await findPreference(userId, strategyKey);
  if (pref.data) {
    return { providerId: pref.data.providerId, modelId: pref.data.modelId };
  }
  return { providerId: "ollama", modelId: "gemma3:1b" };
};
