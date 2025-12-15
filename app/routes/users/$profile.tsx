import type { Route } from "./+types/$profile";
import { usersApi } from "~/lib/api/users.api";
import { parseCookies } from "~/lib/api/utils";
import { LoadingState } from "~/components/async-state/loading";
import { ErrorState } from "~/components/async-state/error";
import { useCurrentUser } from "~/feature/users/hooks/use-users";
import { ProfileScreen } from "~/feature/users/screens/ProfileScreen";

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

export async function loader({ request }: Route.LoaderArgs) {
    const cookieHeader = request.headers.get("Cookie");
    const cookies = parseCookies(cookieHeader);
    const token = cookies.token;
    try {
        const response = await usersApi.getCurrentUser({
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
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
    const { data: user, isLoading, error } = useCurrentUser(token);
    if (isLoading) return <LoadingState />;
    if (error) return <ErrorState error={error} />;
    if (!user) return <ErrorState error={new Error("User not found")} />;
    
    return <ProfileScreen user={user} />;
}