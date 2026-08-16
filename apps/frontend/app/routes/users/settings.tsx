import type { Route } from "./+types/settings";
import { SettingsScreen } from "~/feature/users/screens/SettingsScreen";
import { authContext, userContext } from "~/middleware/context";
import { useUpdateUser } from "@mah/api/hooks/use-users";
import { useAppError } from "~/components/errors/useAppError";
import { MahErrorBoundary } from "~/components/errors/ErrorBoundary";
import { handleRouteError } from "~/lib/errors/errors.utils";

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

export default function SettingsPage({ loaderData }: Route.ComponentProps) {
  const { user, token } = loaderData;
  const updateMutation = useUpdateUser();
  return (
    <SettingsScreen user={user} token={token} updateMutation={updateMutation} />
  );
}

export function ErrorBoundary() {
  const error = useAppError();
  return <MahErrorBoundary status={error.status} data={error.data} />;
}
