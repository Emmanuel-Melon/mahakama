import PageError from "~/components/page-error";
import type { Route } from "./+types/index";
import { NotificationsScreen } from "~/feature/notifications/Screens/NotificationsScreen";
import { useNotifications } from "~/feature/notifications/hooks/use-notifications";
import { useRouteError } from "react-router";
import { authContext } from "~/middleware/context";
import { notificationsApi } from "~/lib/api/notifications.api";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Notifications" },
    ];
}

export async function loader({ context }: Route.LoaderArgs) {
  const token = context.get(authContext)?.token;
  // Fetch data on server
  const notifications = await notificationsApi.getNotifications({ 
    headers: { Authorization: `Bearer ${token}` } 
  });
  return { notifications };
}

export default function NotificationsRoute() {
    const { data: notifications, isLoading, error } = useNotifications();

    if (isLoading) {
        return <div>Loading notifications...</div>;
    }

    if (error) {
        return <div>Error loading notifications</div>;
    }

    return (
        <NotificationsScreen notifications={notifications} />
    );
}

export function ErrorBoundary() {
    const error = useRouteError();

    return (
        <PageError
            title="Failed to load Notifications"
            description="There was an error loading the notifications. Please try again later."
            onRetry={() => window.location.reload()}
        />
    );
}