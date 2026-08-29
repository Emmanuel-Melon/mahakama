import { db } from "@/lib/drizzle";
import {
  mattersTable,
  matterLawyersTable,
  matterNotesTable,
  matterDocumentsTable,
  matterStatusHistoryTable,
  matterEventsTable,
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
} from "../matter.types";
import {
  executeSingle,
  type DbResult,
} from "@/lib/drizzle/results/results.single";

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
