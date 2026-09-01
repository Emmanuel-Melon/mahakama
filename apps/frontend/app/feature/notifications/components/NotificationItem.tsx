import type { FC } from "react";
import type { Notification } from "@mah/api/src/clients/notifications.api";

type NotificationItemProps = {
  notification: Notification;
};

export const NotificationItem: FC<NotificationItemProps> = ({
  notification,
}) => {
  const getStatusColor = (status: string) => {
    // Backend `status` enum values are prefixed (e.g. "notification_opened",
    // "notification_sent"). Normalize to the bare label for styling.
    const normalized = status.replace(/^notification_/, "");
    switch (normalized) {
      case "opened":
      case "read":
        return "bg-gray-100 text-gray-800";
      case "sent":
        return "bg-blue-100 text-blue-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case "push":
        return "📱";
      case "email":
        return "📧";
      case "in_app":
        return "🔔";
      default:
        return "📢";
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 mb-3 bg-white shadow-sm">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">
            {getChannelIcon(notification.channel)}
          </span>
          <h3 className="font-semibold text-gray-900">{notification.title}</h3>
        </div>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(notification.status)}`}
        >
          {notification.status}
        </span>
      </div>

      <p className="text-gray-700 mb-3">{notification.message}</p>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-4">
          <span>Type: {notification.type}</span>
          <span>Channel: {notification.channel}</span>
        </div>
        <div className="text-right">
          <div>
            Created: {new Date(notification.createdAt).toLocaleDateString()}
          </div>
          {notification.sentAt && (
            <div>
              Sent: {new Date(notification.sentAt).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
