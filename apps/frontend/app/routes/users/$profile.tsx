import type { Route } from "./+types/$profile";
import { useCurrentUser, useUpdateUser } from "@mah/api/hooks/use-users";
import { ProfileScreen } from "~/feature/users/screens/ProfileScreen";
import { useAppError } from "~/components/errors/useAppError";
import { MahErrorBoundary } from "~/components/errors/ErrorBoundary";
import { PageDetailsLoading } from "~/components/molecules/page-details-loading";
import { PageDetailsError } from "~/components/molecules/page-details-error";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Profile - Mahakama" },
    {
      name: "description",
      content: "View your Mahakama profile and account details",
    },
  ];
}

export default function ProfilePage() {
  const updateMutation = useUpdateUser();
  const { data, isLoading, error } = useCurrentUser();
  const user = data?.data;

  if (isLoading)
    return (
      <PageDetailsLoading
        title="Loading Profile"
        description="Please wait while we load your profile..."
      />
    );

  if (error || !user)
    return (
      <PageDetailsError
        error={error?.message ?? "Profile not found"}
        title="Error Loading Profile"
        description="We couldn't load your profile. Please try again."
      />
    );

  return <ProfileScreen user={user} updateMutation={updateMutation} />;
}

export function ErrorBoundary() {
  const error = useAppError();
  return <MahErrorBoundary status={error.status} data={error.data} />;
}
