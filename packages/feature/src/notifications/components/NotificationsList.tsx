import { type FC } from "react";
import { NotificationItem } from "./NotificationItem";
import type { Notification } from "@mah/api/src/clients/notifications.api";
import type { AsyncState } from "@mah/api/src/api/api.types";

interface NotificationsListProps {
  notifications: Notification[];
}

export const NotificationsList: FC<NotificationsListProps> = ({
  notifications,
}) => {
  return (
    <div>
      {notifications.map((notification) => (
        <NotificationItem key={notification.id} notification={notification} />
      ))}
    </div>
  );
};
