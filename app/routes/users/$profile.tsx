import type { Route } from "./+types/$profile";
import { usersApi } from "~/lib/api/users.api";
import { useLoaderData } from "react-router";
import { IconContainer } from "~/components/icon-container";
import { Scale, Mail, Phone, MapPin, User, Calendar, Shield } from "lucide-react";
import { BorderedBox } from "~/components/ui/bordered-box";
import { Button } from "~/components/ui/button";
import { HandDrawnAvatar } from "~/components/ui/hand-drawn-avatar";
import { parseCookies } from "~/lib/api/utils";
import { LoadingState } from "~/components/async-state/loading";
import { ErrorState } from "~/components/async-state/error";
import { useCurrentUser } from "~/hooks/use-users";
import { formatDate } from "~/utils/time";

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

export async function loader({ params, request }: Route.LoaderArgs) {
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

function ProfileView() {
    const { token } = useLoaderData<typeof loader>();
    const { data: user, isLoading, error } = useCurrentUser(token);
    if (isLoading) return <LoadingState />;
    if (error) return <ErrorState error={error} />;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
            <div className="container mx-auto px-4 py-8 md:py-16">
                <div className="mx-auto max-w-4xl">
                    {/* Header */}
                    <BorderedBox className="p-6 mb-8" variant="decorated" label="Profile">
                        <div className="flex flex-col md:flex-row gap-8">
                            <div className="flex-shrink-0">
                                <div className="relative">
                                    <HandDrawnAvatar
                                        name={user?.name || user?.email || ""}
                                        size="lg"
                                        className="h-32 w-32 text-4xl"
                                    />
                                </div>
                            </div>

                            <div className="flex-1">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                                            <User className="h-6 w-6 text-blue-600" />
                                            {user?.name || user?.email || ""}
                                        </h1>
                                        <p className="text-gray-600 mt-1 flex items-center gap-2">
                                            <Shield className="h-4 w-4 text-gray-400" />
                                            {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "User"} Account
                                        </p>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-2 border-gray-900"
                                    >
                                        Edit Profile
                                    </Button>
                                </div>

                                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <Mail className="h-5 w-5 text-blue-500" />
                                        <span>{user?.email || ""}</span>
                                    </div>

                                    {user?.phoneNumber && (
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <Phone className="h-5 w-5 text-blue-500" />
                                            <span>{user?.phoneNumber || ""}</span>
                                        </div>
                                    )}

                                    {(user?.city || user?.country) && (
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <MapPin className="h-5 w-5 text-blue-500" />
                                            <span>{[user?.city, user?.country].filter(Boolean).join(', ')}</span>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                                        <Calendar className="h-4 w-4" />
                                        <span>Member since {formatDate(user?.createdAt || "")}</span>
                                    </div>
                                </div>

                                {user?.bio && (
                                    <div className="mt-6 pt-6 border-t border-gray-200">
                                        <h3 className="text-sm font-medium text-gray-500 mb-2">About</h3>
                                        <p className="text-gray-700">{user.bio}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </BorderedBox>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <BorderedBox className="p-6" variant="decorated" label="Account Details">
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Account Status</p>
                                    <p className="mt-1 text-gray-900">
                                        {user?.isOnboarded ? 'Onboarded' : 'Pending Onboarding'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Last Updated</p>
                                    <p className="mt-1 text-gray-900">
                                        {formatDate(user?.updatedAt || "")}
                                    </p>
                                </div>
                            </div>
                        </BorderedBox>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ProfilePage() {
    return <ProfileView />;
}