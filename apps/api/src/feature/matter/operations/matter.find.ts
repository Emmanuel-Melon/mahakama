import { db } from "@/lib/drizzle";
import { eq, inArray } from "drizzle-orm";
import {
  mattersTable,
  matterLawyersTable,
  matterNotesTable,
  matterDocumentsTable,
  matterStatusHistoryTable,
  matterEventsTable,
  matterActivitiesTable,
} from "../matter.schema";
import { lawyersTable } from "@/feature/lawyers/lawyers.schema";
import type {
  MatterWithRelations,
  Matter,
  MattersFilters,
  MatterColumnKey,
  MatterColumn,
  MatterLawyer,
  MatterLawyerColumnKey,
  MatterLawyerColumn,
  MatterNote,
  MatterNoteColumnKey,
  MatterNoteColumn,
  MatterDocument,
  MatterDocumentColumnKey,
  MatterDocumentColumn,
  MatterStatusHistory,
  MatterStatusHistoryColumnKey,
  MatterStatusHistoryColumn,
  MatterEvent,
  MatterEventColumnKey,
  MatterEventColumn,
  MatterActivity,
} from "../matter.types";
import {
  executeSingle,
  type DbResult,
} from "@/lib/drizzle/results/results.single";
import { toManyResult } from "@/lib/drizzle/drizzle.utils";
import { DbManyResult } from "@/lib/drizzle/drizzle.types";
import { paginate } from "@/lib/drizzle/drizzle.paginate";

export const findMatters = async (
  query: MattersFilters,
): Promise<DbManyResult<Matter>> => {
  if (!query.clientUserId && !query.lawyerUserId) {
    return { data: [], count: 0, isEmpty: true };
  }

  const filters = [];

  if (query.clientUserId) {
    filters.push(eq(mattersTable.clientUserId, query.clientUserId));
  }
  if (query.lawyerUserId) {
    filters.push(
      inArray(
        mattersTable.id,
        db
          .select({ matterId: matterLawyersTable.matterId })
          .from(matterLawyersTable)
          .where(
            inArray(
              matterLawyersTable.lawyerId,
              db
                .select({ id: lawyersTable.id })
                .from(lawyersTable)
                .where(eq(lawyersTable.userId, query.lawyerUserId)),
            ),
          ),
      ),
    );
  }
  if (query.status) {
    filters.push(eq(mattersTable.status, query.status));
  }
  if (query.jurisdiction) {
    filters.push(eq(mattersTable.jurisdiction, query.jurisdiction));
  }
  if (query.practiceArea) {
    filters.push(eq(mattersTable.practiceArea, query.practiceArea));
  }

  const result = await paginate<"mattersTable", Matter>(
    "mattersTable",
    mattersTable,
    {
      ...query,
      filters,
      search: {
        q: query.q,
        columns: [mattersTable.title],
      },
    },
  );
  return toManyResult(result);
};

export const findMatter = async <K extends MatterColumnKey>(
  field: K,
  value: MatterColumn[K]["_"]["data"],
): Promise<DbResult<MatterWithRelations>> => {
  return executeSingle(
    db.query.mattersTable.findFirst({
      where: eq(mattersTable[field], value),
      with: {
        lawyers: true,
        notes: true,
        documents: true,
        statusHistory: true,
        events: true,
      },
    }),
  );
};

export const findMatterLawyer = async <K extends MatterLawyerColumnKey>(
  field: K,
  value: MatterLawyerColumn[K]["_"]["data"],
): Promise<DbResult<MatterLawyer>> => {
  return executeSingle(
    db.query.matterLawyersTable.findFirst({
      where: eq(matterLawyersTable[field], value),
    }),
  );
};

export const findMatterLawyersByMatter = async (
  matterId: string,
): Promise<DbManyResult<MatterLawyer>> => {
  const data = await db.query.matterLawyersTable.findMany({
    where: eq(matterLawyersTable.matterId, matterId),
  });
  return toManyResult(data);
};

export const findMatterNote = async <K extends MatterNoteColumnKey>(
  field: K,
  value: MatterNoteColumn[K]["_"]["data"],
): Promise<DbResult<MatterNote>> => {
  return executeSingle(
    db.query.matterNotesTable.findFirst({
      where: eq(matterNotesTable[field], value),
    }),
  );
};

export const findMatterNotesByMatter = async (
  matterId: string,
): Promise<DbManyResult<MatterNote>> => {
  const data = await db.query.matterNotesTable.findMany({
    where: eq(matterNotesTable.matterId, matterId),
  });
  return toManyResult(data);
};

export const findMatterDocument = async <K extends MatterDocumentColumnKey>(
  field: K,
  value: MatterDocumentColumn[K]["_"]["data"],
): Promise<DbResult<MatterDocument>> => {
  return executeSingle(
    db.query.matterDocumentsTable.findFirst({
      where: eq(matterDocumentsTable[field], value),
    }),
  );
};

export const findMatterDocumentsByMatter = async (
  matterId: string,
): Promise<DbManyResult<MatterDocument>> => {
  const data = await db.query.matterDocumentsTable.findMany({
    where: eq(matterDocumentsTable.matterId, matterId),
  });
  return toManyResult(data);
};

export const findMatterStatusHistory = async <
  K extends MatterStatusHistoryColumnKey,
>(
  field: K,
  value: MatterStatusHistoryColumn[K]["_"]["data"],
): Promise<DbResult<MatterStatusHistory>> => {
  return executeSingle(
    db.query.matterStatusHistoryTable.findFirst({
      where: eq(matterStatusHistoryTable[field], value),
    }),
  );
};

export const findMatterStatusHistoriesByMatter = async (
  matterId: string,
): Promise<DbManyResult<MatterStatusHistory>> => {
  const data = await db.query.matterStatusHistoryTable.findMany({
    where: eq(matterStatusHistoryTable.matterId, matterId),
  });
  return toManyResult(data);
};

export const findMatterEvent = async <K extends MatterEventColumnKey>(
  field: K,
  value: MatterEventColumn[K]["_"]["data"],
): Promise<DbResult<MatterEvent>> => {
  return executeSingle(
    db.query.matterEventsTable.findFirst({
      where: eq(matterEventsTable[field], value),
    }),
  );
};

export const findMatterEventsByMatter = async (
  matterId: string,
): Promise<DbManyResult<MatterEvent>> => {
  const data = await db.query.matterEventsTable.findMany({
    where: eq(matterEventsTable.matterId, matterId),
  });
  return toManyResult(data);
};

export const findMatterActivitiesByMatter = async (
  matterId: string,
): Promise<DbManyResult<MatterActivity>> => {
  const data = await db.query.matterActivitiesTable.findMany({
    where: eq(matterActivitiesTable.matterId, matterId),
  });
  return toManyResult(data);
};
