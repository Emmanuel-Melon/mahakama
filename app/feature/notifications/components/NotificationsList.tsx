import { type FC } from "react";
import { NotificationItem } from "./NotificationItem";
import type { Notification } from "~/lib/api/notifications.api";

type NotificationsListProps = {
  notifications: Notification[];
};

export const NotificationsList: FC<NotificationsListProps> = ({ notifications }) => {
  return (
    <div>
      {notifications.map((notification) => (
        <NotificationItem key={notification.id} notification={notification} />
      ))}
    </div>
  );
}