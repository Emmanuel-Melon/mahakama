import { type FC } from "react";
import { NotificationsList } from "../components/NotificationsList";
import type { Notification } from "@mah/api/src/clients/notifications.api";
import { Bell } from "lucide-react";
import { AsyncContainer } from "~/components/organisms/async-state/AsyncBoundary";
import type { AsyncState } from "@mah/api/src/api/api.types";

interface NotificationsScreenProps extends AsyncState {
  notifications?: Notification[];
}

export const NotificationsScreen: FC<NotificationsScreenProps> = ({
  notifications,
  isLoading,
  error,
}) => {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl">Notifications</h1>
      <AsyncContainer
        data={notifications}
        isLoading={isLoading}
        error={error}
        loadingComponent={
          <div className="text-center py-12 text-muted-foreground">
            Loading notifications...
          </div>
        }
        emptyState={{
          icon: Bell,
          badge: "Inbox",
          title: "All caught up!",
          description:
            "You don't have any new notifications right now. Check back later.",
        }}
      >
        <NotificationsList notifications={notifications || []} />
      </AsyncContainer>
    </div>
  );
};
