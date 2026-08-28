import type { Route } from "./+types/settings";
import { SettingsScreen } from "~/feature/users/screens/SettingsScreen";
import { authContext, userContext } from "~/middleware/context";
import { useAppError } from "~/lib/errors/errors.registry";
import { MahErrorBoundary } from "~/components/RootErrorBoundary";
import { handleRouteError } from "@mah/client/errors";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Settings - Mahakama" },
    {
      name: "description",
      content:
        "Settings page for Mahakama account to access your legal resources and history.",
    },
  ];
}

export async function loader({ context }: Route.LoaderArgs) {
  try {
    const user = context.get(userContext);
    const token = context.get(authContext)?.token || null;
    if (!user || !token) {
      throw new Response("User not authenticated", { status: 401 });
    }
    return { user, token, error: null };
  } catch (error) {
    handleRouteError(error, "Failed to load mahakama");
  }
}

export default function SettingsRoute({ loaderData }: Route.ComponentProps) {
  const { user, token } = loaderData;
  return <SettingsScreen user={user} token={token} />;
}

export function ErrorBoundary() {
  const error = useAppError();
  return <MahErrorBoundary status={error.status} data={error.data} />;
}
