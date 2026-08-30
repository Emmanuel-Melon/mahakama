import { db } from "@/lib/drizzle";
import {
  mattersTable,
  matterLawyersTable,
  matterNotesTable,
  matterDocumentsTable,
  matterStatusHistoryTable,
  matterEventsTable,
  matterActivitiesTable,
} from "../matter.schema";
import type {
  NewMatter,
  Matter,
  NewMatterLawyer,
  MatterLawyer,
  NewMatterNote,
  MatterNote,
  NewMatterDocument,
  MatterDocument,
  NewMatterStatusHistory,
  MatterStatusHistory,
  NewMatterEvent,
  MatterEvent,
  NewMatterActivity,
  MatterActivity,
} from "../matter.types";
import {
  executeSingle,
  type DbResult,
} from "@/lib/drizzle/results/results.single";
import { logger } from "@/lib/logger";

export const insertMatter = async (
  params: NewMatter,
): Promise<DbResult<Matter>> => {
  return executeSingle(
    db
      .insert(mattersTable)
      .values({
        ...params,
        title: params.title || "New Matter",
        metadata: params.metadata || {},
      })
      .returning()
      .then(([newMatter]) => newMatter),
  );
};

export const insertMatterLawyer = async (
  params: NewMatterLawyer,
): Promise<DbResult<MatterLawyer>> => {
  return executeSingle(
    db
      .insert(matterLawyersTable)
      .values(params)
      .returning()
      .then(([newMatterLawyer]) => newMatterLawyer),
  );
};

export const insertMatterNote = async (
  params: NewMatterNote,
): Promise<DbResult<MatterNote>> => {
  return executeSingle(
    db
      .insert(matterNotesTable)
      .values(params)
      .returning()
      .then(([newMatterNote]) => newMatterNote),
  );
};

export const insertMatterDocument = async (
  params: NewMatterDocument,
): Promise<DbResult<MatterDocument>> => {
  return executeSingle(
    db
      .insert(matterDocumentsTable)
      .values(params)
      .returning()
      .then(([newMatterDocument]) => newMatterDocument),
  );
};

export const insertMatterStatusHistory = async (
  params: NewMatterStatusHistory,
): Promise<DbResult<MatterStatusHistory>> => {
  return executeSingle(
    db
      .insert(matterStatusHistoryTable)
      .values(params)
      .returning()
      .then(([newHistory]) => newHistory),
  );
};

export const insertMatterEvent = async (
  params: NewMatterEvent,
): Promise<DbResult<MatterEvent>> => {
  return executeSingle(
    db
      .insert(matterEventsTable)
      .values({
        ...params,
        metadata: params.metadata || {},
      })
      .returning()
      .then(([newEvent]) => newEvent),
  );
};

export const insertMatterActivity = async (
  params: NewMatterActivity,
): Promise<DbResult<MatterActivity>> => {
  return executeSingle(
    db
      .insert(matterActivitiesTable)
      .values({
        ...params,
        metadata: params.metadata || {},
      })
      .returning()
      .then(([newActivity]) => newActivity),
  );
};

type RecordMatterActivityParams = {
  matterId: string;
  actorUserId?: string | null;
  type: MatterActivity["type"];
  title: string;
  description?: string | null;
  isInternal?: boolean;
  metadata?: Record<string, unknown>;
};

export const recordMatterActivity = async (
  params: RecordMatterActivityParams,
): Promise<void> => {
  try {
    await insertMatterActivity({
      matterId: params.matterId,
      actorUserId: params.actorUserId ?? null,
      type: params.type,
      title: params.title,
      description: params.description ?? null,
      isInternal: params.isInternal ?? false,
      metadata: params.metadata ?? {},
    });
  } catch (error) {
    logger.error(
      { error, ...params },
      "Failed to record matter activity",
    );
  }
};
