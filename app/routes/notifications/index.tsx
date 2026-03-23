import PageError from "~/components/page-error";
import type { Route } from "./+types/index";
import { NotificationsScreen } from "~/feature/notifications/Screens/NotificationsScreen";
import { useNotifications } from "~/feature/notifications/hooks/use-notifications";
import { useRouteError } from "react-router";
import { PageLayout } from "~/layouts/page-layout";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Notifications" },
    ];
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