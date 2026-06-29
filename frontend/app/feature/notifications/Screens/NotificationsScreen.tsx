import { type FC } from "react";
import { NotificationsList } from "../components/NotificationsList";
import type { Notification } from "~/lib/api/notifications.api";

type NotificationsScreenProps = {
  notifications?: Notification[];
};

const dummyNotifications: Notification[] = [
  {
    id: "1",
    userId: "user-123",
    type: "case_update",
    channel: "in_app",
    title: "Case Update",
    message: "Your case #12345 has been updated with new information from the court.",
    status: "read",
    templateKey: "case_update",
    correlationId: "correlation-123",
    metadata: { caseId: "12345" },
    scheduledAt: "2023-03-23T10:00:00Z",
    sentAt: "2023-03-23T10:01:00Z",
    createdAt: "2023-03-23T09:59:00Z",
    updatedAt: "2023-03-23T10:02:00Z",
  },
  {
    id: "2",
    userId: "user-123",
    type: "appointment_reminder",
    channel: "push",
    title: "Appointment Reminder",
    message: "You have a scheduled appointment with your lawyer tomorrow at 2:00 PM.",
    status: "sent",
    templateKey: "appointment_reminder",
    correlationId: "correlation-124",
    metadata: { appointmentId: "67890", time: "2023-03-24T14:00:00Z" },
    scheduledAt: "2023-03-23T08:00:00Z",
    sentAt: "2023-03-23T08:01:00Z",
    createdAt: "2023-03-23T07:59:00Z",
    updatedAt: "2023-03-23T08:01:00Z",
  },
  {
    id: "3",
    userId: "user-123",
    type: "document_ready",
    channel: "email",
    title: "Document Ready",
    message: "Your requested legal document has been prepared and is ready for review.",
    status: "delivered",
    templateKey: "document_ready",
    correlationId: "correlation-125",
    metadata: { documentId: "doc-456", documentType: "contract" },
    scheduledAt: "2023-03-22T16:00:00Z",
    sentAt: "2023-03-22T16:01:00Z",
    createdAt: "2023-03-22T15:59:00Z",
    updatedAt: "2023-03-22T16:02:00Z",
  },
];

export const NotificationsScreen: FC<NotificationsScreenProps> = ({ notifications }) => {
  const notificationsToDisplay = notifications || dummyNotifications;

  return (
    <div>
      <h1>Notifications</h1>
      <NotificationsList notifications={notificationsToDisplay} />
    </div>
  );
};