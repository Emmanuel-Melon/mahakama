import { db } from "@/lib/drizzle";
import {
  inferenceModelsSchema,
  userInferencePreferencesSchema,
} from "../inference.schema";
import { and, eq } from "drizzle-orm";
import { toSingleResult, toManyResult } from "@/lib/drizzle/drizzle.utils";
import type { DbSingleResult, DbManyResult } from "@/lib/drizzle/drizzle.types";
import type {
  IInferenceStrategy,
  InferencePreference,
} from "../inference.types";
import { InferenceStrategyRegistry } from "../inference.registry";

export const findPreference = async (
  userId: string,
  strategyKey: string,
): Promise<DbSingleResult<InferencePreference>> => {
  const result = await db.query.userInferencePreferencesSchema.findFirst({
    where: and(
      eq(userInferencePreferencesSchema.userId, userId),
      eq(userInferencePreferencesSchema.strategyKey, strategyKey),
    ),
  });
  return toSingleResult(result);
};

export const findUserPreference = async (
  userId: string,
  strategyKey: string,
) => {
  return await db.query.userInferencePreferencesSchema.findFirst({
    where: and(
      eq(userInferencePreferencesSchema.userId, userId),
      eq(userInferencePreferencesSchema.strategyKey, strategyKey),
    ),
  });
};

export const getInferenceProviders = async () => {
  const result = await db.query.inferenceProvidersSchema.findMany({
    with: {
      models: true,
    },
  });

  return toManyResult(result);
};

export const findModelById = async (modelId: string) => {
  const result = await db.query.inferenceModelsSchema.findFirst({
    where: and(
      eq(inferenceModelsSchema.id, modelId),
      eq(inferenceModelsSchema.isActive, true),
    ),
  });

  return toSingleResult(result);
};

export interface StrategyResource {
  key: string;
}

export const getInferenceStrategies = () => {
  const keys = InferenceStrategyRegistry.registeredKeys();

  const strategies = keys.map((key) => {
    const strategy = InferenceStrategyRegistry.get(key);
    return {
      ...strategy,
      id: strategy.key,
    };
  });

  return {
    data: strategies,
    count: strategies.length,
  };
};
