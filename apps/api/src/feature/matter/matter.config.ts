import { JsonApiResourceConfig } from "@/lib/express/express.types";
import type {
  Matter,
  MatterLawyer,
  MatterNote,
  MatterDocument,
  MatterStatusHistory,
  MatterEvent,
  MatterActivity,
} from "./matter.types";

export const MatterSerializer: JsonApiResourceConfig<Matter> = {
  type: "matter",
  attributes: (matter: Matter) => matter,
};

export const MatterLawyerSerializer: JsonApiResourceConfig<MatterLawyer> = {
  type: "matter-lawyer",
  attributes: (matterLawyer: MatterLawyer) => matterLawyer,
};

export const MatterNoteSerializer: JsonApiResourceConfig<MatterNote> = {
  type: "matter-note",
  attributes: (matterNote: MatterNote) => matterNote,
};

export const MatterDocumentSerializer: JsonApiResourceConfig<MatterDocument> = {
  type: "matter-document",
  attributes: (matterDocument: MatterDocument) => matterDocument,
};

export const MatterStatusHistorySerializer: JsonApiResourceConfig<MatterStatusHistory> =
  {
    type: "matter-status-history",
    attributes: (statusHistory: MatterStatusHistory) => statusHistory,
  };

export const MatterEventSerializer: JsonApiResourceConfig<MatterEvent> = {
  type: "matter-event",
  attributes: (matterEvent: MatterEvent) => matterEvent,
};

export const MatterActivitySerializer: JsonApiResourceConfig<MatterActivity> = {
  type: "matter-activity",
  attributes: (matterActivity: MatterActivity) => matterActivity,
};

export const MattersJobs = {
  MatterFromChat: "matter-from-chat",
  GenerateMatterSummary: "generate-matter-summary",
  MatterStatusChanged: "matter-status-changed",
  LawyerInvitedToMatter: "lawyer-invited-to-matter",
} as const;

export type MattersJobType = (typeof MattersJobs)[keyof typeof MattersJobs];
