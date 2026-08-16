import { db } from "@/lib/drizzle";
import {
  inferenceModelsSchema,
  userInferencePreferencesSchema,
} from "../inference.schema";
import { and, eq } from "drizzle-orm";
import { toSingleResult, toManyResult } from "@/lib/drizzle/drizzle.utils";
import type { DbSingleResult, DbManyResult } from "@/lib/drizzle/drizzle.types";
import type {
  InferenceModel,
  InferenceModelColumn,
  InferenceModelColumnKey,
  InferencePreference,
  InferenceProvider,
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

export const findInferenceProviders = async (): Promise<
  DbManyResult<InferenceProvider>
> => {
  const result = await db.query.inferenceProvidersSchema.findMany({
    with: {
      models: true,
    },
  });

  return toManyResult(result);
};

export const findModel = async <K extends InferenceModelColumnKey>(
  field: K,
  value: InferenceModelColumn[K]["_"]["data"],
): Promise<DbSingleResult<InferenceModel>> => {
  const result = await db.query.inferenceModelsSchema.findFirst({
    where: and(
      eq(inferenceModelsSchema[field], value),
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
