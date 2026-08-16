import { type FC } from "react";
import { NotificationItem } from "./NotificationItem";
import type { Notification } from "@mah/api/clients/notifications.api";

type NotificationsListProps = {
  notifications: Notification[];
};

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
