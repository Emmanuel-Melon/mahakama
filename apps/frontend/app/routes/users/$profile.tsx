import type { Route } from "./+types/$profile";
import { useCurrentUser } from "@mah/api/src/hooks/use-users";
import { ProfileScreen } from "~/feature/users/screens/ProfileScreen";
import { useAppError } from "~/lib/errors/errors.registry";
import { MahErrorBoundary } from "~/components/RootErrorBoundary";
import { handleRouteError } from "@mah/client/errors";
import type { SavedItem } from "~/feature/users/components/profile/SavedItems";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Profile - Mahakama" },
    {
      name: "description",
      content: "View your Mahakama profile and account details",
    },
  ];
}

export default function UserProfileRoute() {
  const { data, isLoading, error } = useCurrentUser();
  const user = data?.data;

  // Dummy data for saved items passed from route/data layer
  const savedItems: SavedItem[] = [
    {
      type: "lawyer",
      title: "John Smith",
      description: "Criminal Defense Lawyer",
      savedDate: "2 days ago",
      href: "/lawyers/1",
      onShare: () => alert("Sharing John Smith profile"),
      onDelete: () => alert("Deleting John Smith profile"),
    },
    {
      type: "lawyer",
      title: "Sarah Johnson",
      description: "Family Law Specialist",
      savedDate: "1 week ago",
      href: "/lawyers/2",
      onShare: () => alert("Sharing Sarah Johnson profile"),
      onDelete: () => alert("Deleting Sarah Johnson profile"),
    },
    {
      type: "document",
      title: "Contract Agreement Template",
      description: "Legal Document",
      savedDate: "3 days ago",
      href: "/documents/contract-template",
      onShare: () => alert("Sharing Contract Agreement Template"),
      onDelete: () => alert("Deleting Contract Agreement Template"),
    },
    {
      type: "document",
      title: "Tenant Rights Guide",
      description: "Legal Guide",
      savedDate: "2 weeks ago",
      href: "/documents/tenant-rights",
      onShare: () => alert("Sharing Tenant Rights Guide"),
      onDelete: () => alert("Deleting Tenant Rights Guide"),
    },
    {
      type: "lawyer",
      title: "Michael Davis",
      description: "Corporate Attorney",
      savedDate: "1 month ago",
      href: "/lawyers/3",
      onShare: () => alert("Sharing Michael Davis profile"),
      onDelete: () => alert("Deleting Michael Davis profile"),
    },
  ];

  return (
    <ProfileScreen
      user={user}
      isLoading={isLoading}
      error={error}
      savedItems={savedItems}
    />
  );
}

export function ErrorBoundary() {
  const error = useAppError();
  return <MahErrorBoundary status={error.status} data={error.data} />;
}
