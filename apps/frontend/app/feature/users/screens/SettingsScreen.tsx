import { Button } from "@mah/ui/components/Button";
import { useState, type FC } from "react";
import { UserProfileForm } from "~/feature/users/components/settings/UserProfileForm";
import { ProfileHeader } from "~/feature/users/components/profile/ProfileHeader";
import { ContactInformation } from "~/feature/users/components/profile/ContactInformation";
import { AccountManagement } from "~/feature/users/components/settings/AccountManagement";
import { ProfileTabs } from "~/feature/users/components/ProfileTabs";
import type { User } from "@mah/api/src/clients/users.api";
import { useUpdateUser } from "@mah/api/src/hooks/use-users";

interface SettingsScreenProps {
  user: User;
  token: string;
}

export const SettingsScreen: FC<SettingsScreenProps> = ({ user }) => {
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

  const handleLogout = () => {
    // Add logout logic here
    console.log("Logging out...");
  };

  if (isEditing) {
    return (
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
    );
  }

  return (
    <div>
      <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "personal" && (
        <div>
          <ProfileHeader user={user} onEditProfile={handleEditProfile} />
          <ContactInformation user={user} />
        </div>
      )}

      {activeTab === "account" && (
        <AccountManagement user={user} onLogout={handleLogout} />
      )}
    </div>
  );
};
