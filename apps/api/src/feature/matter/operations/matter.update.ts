import { db } from "@/lib/drizzle";
import {
  mattersTable,
  matterLawyersTable,
  matterNotesTable,
  matterDocumentsTable,
  matterEventsTable,
} from "../matter.schema";
import { eq } from "drizzle-orm";
import {
  MatterColumn,
  MatterColumnKey,
  UpdateMatter,
  type Matter,
  MatterLawyerColumn,
  MatterLawyerColumnKey,
  UpdateMatterLawyer,
  type MatterLawyer,
  MatterNoteColumn,
  MatterNoteColumnKey,
  UpdateMatterNote,
  type MatterNote,
  MatterDocumentColumn,
  MatterDocumentColumnKey,
  UpdateMatterDocument,
  type MatterDocument,
  MatterEventColumn,
  MatterEventColumnKey,
  UpdateMatterEvent,
  type MatterEvent,
} from "../matter.types";
import {
  executeSingle,
  type DbResult,
} from "@/lib/drizzle/results/results.single";

export const updateMatter = async <K extends MatterColumnKey>(
  field: K,
  value: MatterColumn[K]["_"]["data"],
  data: UpdateMatter,
): Promise<DbResult<Matter>> => {
  return executeSingle(
    db
      .update(mattersTable)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(mattersTable[field], value))
      .returning()
      .then(([result]) => result),
  );
};

export const updateMatterLawyer = async <K extends MatterLawyerColumnKey>(
  field: K,
  value: MatterLawyerColumn[K]["_"]["data"],
  data: UpdateMatterLawyer,
): Promise<DbResult<MatterLawyer>> => {
  return executeSingle(
    db
      .update(matterLawyersTable)
      .set(data)
      .where(eq(matterLawyersTable[field], value))
      .returning()
      .then(([result]) => result),
  );
};

export const updateMatterNote = async <K extends MatterNoteColumnKey>(
  field: K,
  value: MatterNoteColumn[K]["_"]["data"],
  data: UpdateMatterNote,
): Promise<DbResult<MatterNote>> => {
  return executeSingle(
    db
      .update(matterNotesTable)
      .set(data)
      .where(eq(matterNotesTable[field], value))
      .returning()
      .then(([result]) => result),
  );
};

export const updateMatterDocument = async <K extends MatterDocumentColumnKey>(
  field: K,
  value: MatterDocumentColumn[K]["_"]["data"],
  data: UpdateMatterDocument,
): Promise<DbResult<MatterDocument>> => {
  return executeSingle(
    db
      .update(matterDocumentsTable)
      .set(data)
      .where(eq(matterDocumentsTable[field], value))
      .returning()
      .then(([result]) => result),
  );
};

export const updateMatterEvent = async <K extends MatterEventColumnKey>(
  field: K,
  value: MatterEventColumn[K]["_"]["data"],
  data: UpdateMatterEvent,
): Promise<DbResult<MatterEvent>> => {
  return executeSingle(
    db
      .update(matterEventsTable)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(matterEventsTable[field], value))
      .returning()
      .then(([result]) => result),
  );
};
