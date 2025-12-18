import type { Route } from "./+types/$profile";
import { usersApi, UsersApiClient } from "~/lib/api/users.api";
import { FetchApiClient } from "~/lib/api/fetch";
import { LoadingState } from "~/components/async-state/loading";
import { ErrorState } from "~/components/async-state/error";
import { useCurrentUser, useUpdateUser } from "~/feature/users/hooks/use-users";
import { ProfileScreen } from "~/feature/users/screens/ProfileScreen";
import { authContext, userContext } from "~/middleware/context";

export function meta({ loaderData }: Route.MetaArgs) {
    const { user } = loaderData;
    return [
        { title: `${user?.name || 'Profile'} - Mahakama` },
        {
            name: "description",
            content: user?.bio || "View your Mahakama profile and account details",
        },
    ];
}

export async function loader({ context, request }: Route.LoaderArgs) {
    const token = context.get(authContext)?.token || null;
    try {
        // Create API client with cookie from request headers for server-side call
        const cookieHeader = request.headers.get('cookie');
        const apiClient = cookieHeader ? new UsersApiClient(new FetchApiClient({ Cookie: cookieHeader })) : usersApi;
        
        const response = await apiClient.getCurrentUser();
        if (!response) {
            throw new Response("User not found", { status: 404 });
        }
        return { token, user: response };
    } catch (error) {
        console.error("Failed to load user profile:", error);
        throw new Response("Failed to load profile", { status: 500 });
    }
}

export default function ProfilePage({ loaderData }: Route.ComponentProps) {
    const { token } = loaderData;
    const { data: user, isLoading, error } = useCurrentUser();
    const updateMutation = useUpdateUser();
    
    if (isLoading) return <LoadingState />;
    if (error) return <ErrorState error={error} />;
    if (!user) return <ErrorState error={new Error("User not found")} />;

    return <ProfileScreen user={user} updateMutation={updateMutation} />;
}