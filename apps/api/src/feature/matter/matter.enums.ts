import { pgEnum } from "drizzle-orm/pg-core";

export const matterStatusEnum = pgEnum("matter_status", [
  "draft",
  "open",
  "waiting_client",
  "waiting_lawyer",
  "in_progress",
  "resolved",
  "closed",
  "archived",
]);

export const matterLawyerRoleEnum = pgEnum("matter_lawyer_role", [
  "primary",
  "consulting",
  "referred",
]);

export const matterEventTypeEnum = pgEnum("matter_event_type", [
  "hearing",
  "deadline",
  "reminder",
  "meeting",
  "follow_up",
  "other",
]);

export const matterActivityTypeEnum = pgEnum("matter_activity_type", [
  "matter_created",
  "status_changed",
  "note_added",
  "document_uploaded",
  "document_analyzed",
  "lawyer_invited",
  "lawyer_accepted",
  "lawyer_declined",
  "event_created",
  "event_updated",
  "event_completed",
  "chat_linked",
  "summary_updated",
  "system",
]);

export const matterCreatorTypeEnum = pgEnum("matter_creator_type", [
  "client", // client opened it themselves
  "lawyer", // an independent lawyer opened it on behalf of a client
  "org",    // a lawyer opened it while acting within a firm
]);

export const matterOwnerTypeEnum = pgEnum("matter_owner_type", [
  "user",     // client is a registered platform user
  "org",      // client is a registered client-org (company)
  "external", // client has no platform account — contact captured inline
]);