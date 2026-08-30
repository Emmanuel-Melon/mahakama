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
