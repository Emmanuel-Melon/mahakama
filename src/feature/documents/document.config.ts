import { JsonApiResourceConfig } from "@/lib/express/express.types";
import { documentSelectSchema, type Document } from "./documents.types";

export const DocumentsSerializer: JsonApiResourceConfig<Document> = {
  type: "document",
  attributes: (document: Document) => documentSelectSchema.parse(document),
};

export const DocumentRagCollections = {
  DocumentSummaries: {
    label: "summary",
  },
};

export const DocumentJobs = {
  DocumentUploaded: "document-uploaded",
} as const;

export type DocumentsJobType = (typeof DocumentJobs)[keyof typeof DocumentJobs];

// for pagination and route queries
export const sortableFields = [
  "createdAt",
  "updatedAt",
  "title",
  "downloadCount",
] as const;
export const searchableFields = ["title", "description", "type"] as const;
export type SearchableField = (typeof searchableFields)[number];
export type SortableField = (typeof sortableFields)[number];
