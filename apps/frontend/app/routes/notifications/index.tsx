import type { Route } from "./+types/index";
import { NotificationsScreen } from "@mah/feature/notifications";
import { useNotifications } from "@mah/api/src/hooks/use-notifications";
import { useLoaderData } from "react-router";
import { authContext } from "~/middleware/context";
import { notificationsApi } from "@mah/api/src/clients/notifications.api";
import { useAppError } from "~/lib/errors/errors.registry";
import { MahErrorBoundary } from "~/components/RootErrorBoundary";
import { handleRouteError } from "@mah/client/errors";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Notifications" }];
}

export async function loader({ context }: Route.LoaderArgs) {
  const token = context.get(authContext)?.token;
  const { data: notifications } = await notificationsApi.getNotifications({
    headers: { Authorization: `Bearer ${token}` },
  });
  return { notifications };
}

export default function NotificationsRoute() {
  const { notifications: initialNotifications } =
    useLoaderData<typeof loader>();
  const { data: notificationsPage, isLoading, error } = useNotifications();

  return (
    <NotificationsScreen
      notifications={notificationsPage?.data || initialNotifications}
      isLoading={isLoading}
      error={error}
    />
  );
}

export function ErrorBoundary() {
  const error = useAppError();

  return <MahErrorBoundary status={error.status} data={error.data} />;
}
