import { Button } from "~/components/ui/button";
import { useState } from "react";
import { UserProfileForm } from "~/feature/users/components/UserProfileForm";
import { PageLayout } from "~/layouts/page-layout";
import { ProfileHeader } from "~/feature/users/components/ProfileHeader";
import { ContactInformation } from "~/feature/users/components/ContactInformation";
import { AccountManagement } from "~/feature/users/components/AccountManagement";
import { ProfileTabs } from "~/feature/users/components/ProfileTabs";

import type { components } from "~/lib/api/generated/api.types";
export type User = components["schemas"]["User"];

interface SettingsScreenProps {
  user: User;
  token: string;
  updateMutation: any; 
}

export const SettingsScreen = ({ user, token, updateMutation }: SettingsScreenProps) => {
  const [activeTab, setActiveTab] = useState<"personal" | "account">("personal");
  const [isEditing, setIsEditing] = useState(false);

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
      <PageLayout>
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
      </PageLayout>
    );
  }

  return (
    <PageLayout>
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
    </PageLayout>
  );
};
