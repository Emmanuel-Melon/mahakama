import type { Route } from "./+types/$profile";
import { usersApi, UsersApiClient } from "~/lib/api/users.api";
import { FetchApiClient } from "~/lib/api/fetch";
import { useCurrentUser, useUpdateUser } from "~/feature/users/hooks/use-users";
import { ProfileScreen } from "~/feature/users/screens/ProfileScreen";
import { authContext, userContext } from "~/middleware/context";
import { useAppError } from "~/components/errors/useAppError";
import { MahErrorBoundary } from "~/components/errors/ErrorBoundary";
import { handleRouteError } from "~/lib/errors/errors.utils";

export function meta({ loaderData }: Route.MetaArgs) {
  const { user } = loaderData;
  return [
    { title: `${user?.name || "Profile"} - Mahakama` },
    {
      name: "description",
      content: user?.bio || "View your Mahakama profile and account details",
    },
  ];
}

export async function loader({ context, request }: Route.LoaderArgs) {
  const token = context.get(authContext)?.token || null;
  try {
    const cookieHeader = request.headers.get("cookie");
    const apiClient = cookieHeader
      ? new UsersApiClient(new FetchApiClient({ Cookie: cookieHeader }))
      : usersApi;
    const response = await apiClient.getCurrentUser();
    return { token, user: response };
  } catch (error) {
    handleRouteError(error, "Failed to load user profile");
  }
}

export default function ProfilePage({ loaderData }: Route.ComponentProps) {
  const { token } = loaderData;
  const { data: user, isLoading, error } = useCurrentUser();
  const updateMutation = useUpdateUser();

  return <ProfileScreen user={user} updateMutation={updateMutation} />;
}

export function ErrorBoundary() {
  const error = useAppError();
  return <MahErrorBoundary status={error.status} data={error.data} />;
}
