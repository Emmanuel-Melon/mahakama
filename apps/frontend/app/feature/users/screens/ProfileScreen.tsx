import { Button } from "~/components/ui/button";
import { useState, type FC } from "react";
import { UserProfileForm } from "~/feature/users/components/settings/UserProfileForm";
import { ProfileHeader } from "~/feature/users/components/profile/ProfileHeader";
import { ContactInformation } from "~/feature/users/components/profile/ContactInformation";
import { ProfileTabs } from "~/feature/users/components/ProfileTabs";
import type { User } from "@mah/api/src/clients/users.api";
import { type SavedItem, SavedItems } from "../components/profile/SavedItems";
import { AsyncContainer } from "~/components/organisms/async-state/AsyncBoundary";
import { UserCheck } from "lucide-react";
import type { AsyncState } from "@mah/api/src/api/api.types";
import { UserDetailsSection } from "../components/profile/UserDetailsSection";
import { useUpdateUser } from "@mah/api/src/hooks/use-users";

interface ProfileScreenProps extends AsyncState {
  user?: User;
  savedItems: SavedItem[];
}

export const ProfileScreen: FC<ProfileScreenProps> = ({
  user,
  isLoading,
  error,
  savedItems,
}) => {
  const [activeTab, setActiveTab] = useState<"personal" | "account">(
    "personal",
  );
  const [isEditing, setIsEditing] = useState(false);

  // Instantiate the update mutation hook directly inside the screen
  const updateMutation = useUpdateUser();

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleFormSubmit = () => {
    setIsEditing(false);
  };

  return (
    <AsyncContainer
      data={user}
      isLoading={isLoading}
      error={error}
      loadingComponent={
        <div className="text-center py-12 text-muted-foreground">
          Loading your profile...
        </div>
      }
      emptyState={{
        icon: UserCheck,
        badge: "Account",
        title: "Profile Not Found",
        description:
          "We couldn't load your profile details. Please try again later.",
      }}
    >
      {user && (
        <>
          {isEditing ? (
            <div className="mx-auto max-w-6xl p-6">
              <div className="mb-8 flex items-center justify-between">
                <h2 className="text-2xl font-bold">Edit Your Profile</h2>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  Cancel
                </Button>
              </div>
              <UserProfileForm
                user={user}
                updateMutation={updateMutation}
                mode="edit"
                onSubmit={handleFormSubmit}
              />
            </div>
          ) : (
            <div>
              <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />
              {activeTab === "personal" && (
                <div>
                  <ProfileHeader
                    user={user}
                    onEditProfile={handleEditProfile}
                  />
                  <UserDetailsSection user={user} />
                  <ContactInformation user={user} />
                </div>
              )}
              {activeTab === "account" && (
                <div>
                  <SavedItems
                    title="Bookmarks & Saved Items"
                    description="Your saved lawyers and legal documents for quick access."
                    savedItems={savedItems}
                  />
                </div>
              )}
            </div>
          )}
        </>
      )}
    </AsyncContainer>
  );
};
