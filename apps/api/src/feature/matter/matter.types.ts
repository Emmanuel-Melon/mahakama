import { z } from "zod";
import { createSelectSchema, createInsertSchema } from "drizzle-zod";
import {
  mattersTable,
  matterLawyersTable,
  matterNotesTable,
  matterDocumentsTable,
  matterStatusHistoryTable,
  matterEventsTable,
} from "./matter.schema";
import { baseQuerySchema } from "@/lib/express/express.types";
import { crudMeta } from "@/lib/openapi/openapi.utils";
import { MattersJobs } from "./matter.config";

/*
 * DRIZZLE-GENERATED SCHEMAS (from PostgreSQL tables)
 */

// Matters
const baseMatterInsert = createInsertSchema(mattersTable);
const baseMatterSelect = createSelectSchema(mattersTable);

export const matterSelectSchema = crudMeta(
  baseMatterSelect,
  "select",
  "Matter",
);
export const matterInsertSchema = crudMeta(
  baseMatterInsert,
  "insert",
  "Matter",
);
export const matterUpdateSchema = crudMeta(
  baseMatterInsert
    .omit({ id: true, clientUserId: true, createdAt: true })
    .partial(),
  "update",
  "Matter",
);

export const mattersQuerySchema = baseQuerySchema.extend({
  clientUserId: z.string().optional(),
  lawyerUserId: z.string().optional(),
  status: z.string().optional(),
  jurisdiction: z.string().optional(),
  practiceArea: z.string().optional(),
});

// Matter Lawyers
const baseMatterLawyerInsert = createInsertSchema(matterLawyersTable);
const baseMatterLawyerSelect = createSelectSchema(matterLawyersTable);

export const matterLawyerSelectSchema = crudMeta(
  baseMatterLawyerSelect,
  "select",
  "MatterLawyer",
);
export const matterLawyerInsertSchema = crudMeta(
  baseMatterLawyerInsert,
  "insert",
  "MatterLawyer",
);
export const matterLawyerUpdateSchema = crudMeta(
  baseMatterLawyerInsert
    .omit({ id: true, matterId: true, invitedAt: true })
    .partial()
    .extend({
      acceptedAt: z.coerce.date().nullable().optional(),
    }),
  "update",
  "MatterLawyer",
);

// Matter Notes
const baseMatterNoteInsert = createInsertSchema(matterNotesTable);
const baseMatterNoteSelect = createSelectSchema(matterNotesTable);

export const matterNoteSelectSchema = crudMeta(
  baseMatterNoteSelect,
  "select",
  "MatterNote",
);
export const matterNoteInsertSchema = crudMeta(
  baseMatterNoteInsert,
  "insert",
  "MatterNote",
);
export const matterNoteUpdateSchema = crudMeta(
  baseMatterNoteInsert
    .omit({ id: true, matterId: true, authorUserId: true, createdAt: true })
    .partial(),
  "update",
  "MatterNote",
);

// Matter Documents
const baseMatterDocumentInsert = createInsertSchema(matterDocumentsTable);
const baseMatterDocumentSelect = createSelectSchema(matterDocumentsTable);

export const matterDocumentSelectSchema = crudMeta(
  baseMatterDocumentSelect,
  "select",
  "MatterDocument",
);
export const matterDocumentInsertSchema = crudMeta(
  baseMatterDocumentInsert,
  "insert",
  "MatterDocument",
);
export const matterDocumentUpdateSchema = crudMeta(
  baseMatterDocumentInsert
    .omit({ id: true, matterId: true, uploadedByUserId: true, createdAt: true })
    .partial(),
  "update",
  "MatterDocument",
);

// Matter Status History
const baseMatterStatusHistoryInsert = createInsertSchema(
  matterStatusHistoryTable,
);
const baseMatterStatusHistorySelect = createSelectSchema(
  matterStatusHistoryTable,
);

export const matterStatusHistorySelectSchema = crudMeta(
  baseMatterStatusHistorySelect,
  "select",
  "MatterStatusHistory",
);
export const matterStatusHistoryInsertSchema = crudMeta(
  baseMatterStatusHistoryInsert,
  "insert",
  "MatterStatusHistory",
);

// Matter Events
const baseMatterEventInsert = createInsertSchema(matterEventsTable);
const baseMatterEventSelect = createSelectSchema(matterEventsTable);

export const matterEventSelectSchema = crudMeta(
  baseMatterEventSelect,
  "select",
  "MatterEvent",
);
export const matterEventInsertSchema = crudMeta(
  baseMatterEventInsert,
  "insert",
  "MatterEvent",
);
export const matterEventUpdateSchema = crudMeta(
  baseMatterEventInsert
    .omit({ id: true, matterId: true, createdByUserId: true, createdAt: true })
    .partial(),
  "update",
  "MatterEvent",
);

/*
 * DOMAIN-RELATED TYPES
 */

export type Matter = z.infer<typeof matterSelectSchema>;
export type NewMatter = z.infer<typeof matterInsertSchema>;
export type UpdateMatter = z.infer<typeof matterUpdateSchema>;
export type MatterAttrs = z.infer<typeof mattersTable>;
export type MatterResponse = z.infer<typeof matterSelectSchema>;
export type MattersFilters = z.infer<typeof mattersQuerySchema>;

export type MatterLawyer = z.infer<typeof matterLawyerSelectSchema>;
export type NewMatterLawyer = z.infer<typeof matterLawyerInsertSchema>;
export type UpdateMatterLawyer = z.infer<typeof matterLawyerUpdateSchema>;
export type MatterLawyerAttrs = z.infer<typeof matterLawyersTable>;

export type MatterNote = z.infer<typeof matterNoteSelectSchema>;
export type NewMatterNote = z.infer<typeof matterNoteInsertSchema>;
export type UpdateMatterNote = z.infer<typeof matterNoteUpdateSchema>;
export type MatterNoteAttrs = z.infer<typeof matterNotesTable>;

export type MatterDocument = z.infer<typeof matterDocumentSelectSchema>;
export type NewMatterDocument = z.infer<typeof matterDocumentInsertSchema>;
export type UpdateMatterDocument = z.infer<typeof matterDocumentUpdateSchema>;
export type MatterDocumentAttrs = z.infer<typeof matterDocumentsTable>;

export type MatterStatusHistory = z.infer<
  typeof matterStatusHistorySelectSchema
>;
export type NewMatterStatusHistory = z.infer<
  typeof matterStatusHistoryInsertSchema
>;
export type MatterStatusHistoryAttrs = z.infer<typeof matterStatusHistoryTable>;

export type MatterEvent = z.infer<typeof matterEventSelectSchema>;
export type NewMatterEvent = z.infer<typeof matterEventInsertSchema>;
export type UpdateMatterEvent = z.infer<typeof matterEventUpdateSchema>;
export type MatterEventAttrs = z.infer<typeof matterEventsTable>;

export type MatterWithRelations = Matter & {
  lawyers?: MatterLawyer[];
  notes?: MatterNote[];
  documents?: MatterDocument[];
  statusHistory?: MatterStatusHistory[];
  events?: MatterEvent[];
};

/*
 * DATABASE QUERY TYPES
 */

export type MatterColumn = typeof mattersTable._.columns;
export type MatterColumnKey = keyof MatterColumn;

export type MatterLawyerColumn = typeof matterLawyersTable._.columns;
export type MatterLawyerColumnKey = keyof MatterLawyerColumn;

export type MatterNoteColumn = typeof matterNotesTable._.columns;
export type MatterNoteColumnKey = keyof MatterNoteColumn;

export type MatterDocumentColumn = typeof matterDocumentsTable._.columns;
export type MatterDocumentColumnKey = keyof MatterDocumentColumn;

export type MatterStatusHistoryColumn =
  typeof matterStatusHistoryTable._.columns;
export type MatterStatusHistoryColumnKey = keyof MatterStatusHistoryColumn;

export type MatterEventColumn = typeof matterEventsTable._.columns;
export type MatterEventColumnKey = keyof MatterEventColumn;

/*
 * QUEUE-RELATED TYPES
 */

export const MatterFromChatPayloadSchema = z.object({
  chatId: z.string(),
  clientUserId: z.string(),
  matterId: z.string().optional(),
});

export const GenerateMatterSummaryPayloadSchema = z.object({
  matterId: z.string(),
  clientUserId: z.string().optional(),
});

export const MatterStatusChangedPayloadSchema = z.object({
  matterId: z.string(),
  fromStatus: z.string().optional(),
  toStatus: z.string(),
  changedByUserId: z.string().optional(),
});

export const LawyerInvitedToMatterPayloadSchema = z.object({
  matterId: z.string(),
  lawyerId: z.string(),
  invitedByUserId: z.string().optional(),
});

export type MatterFromChatPayload = z.infer<
  typeof MatterFromChatPayloadSchema
>;
export type GenerateMatterSummaryPayload = z.infer<
  typeof GenerateMatterSummaryPayloadSchema
>;
export type MatterStatusChangedPayload = z.infer<
  typeof MatterStatusChangedPayloadSchema
>;
export type LawyerInvitedToMatterPayload = z.infer<
  typeof LawyerInvitedToMatterPayloadSchema
>;

export interface MatterJobMap {
  [MattersJobs.MatterFromChat]: MatterFromChatPayload;
  [MattersJobs.GenerateMatterSummary]: GenerateMatterSummaryPayload;
  [MattersJobs.MatterStatusChanged]: MatterStatusChangedPayload;
  [MattersJobs.LawyerInvitedToMatter]: LawyerInvitedToMatterPayload;
}

/*
 * API PARAMETER TYPES
 */

export interface ListMattersParams {
  clientUserId?: string;
  limit?: number;
  offset?: number;
}

export type DeleteMatterOptions = {
  clientUserId?: string;
};

/*
 * RESPONSE TYPES
 */

export interface MatterListEntry extends Omit<Matter, "clientUserId"> {
  lawyerCount: number;
  documentCount: number;
  pendingEventsCount: number;
}
