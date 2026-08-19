import { Button } from "~/components/ui/button";
import { useState } from "react";
import { UserProfileForm } from "~/feature/users/components/UserProfileForm";
import { ProfileHeader } from "~/feature/users/components/ProfileHeader";
import { ContactInformation } from "~/feature/users/components/ContactInformation";
import { AccountStatusCard } from "~/feature/users/components/AccountStatusCard";
import { ActivityCard } from "~/feature/users/components/ActivityCard";
import { ProfileTabs } from "~/feature/users/components/ProfileTabs";
import { SavedItems, type SavedItem } from "~/components/saved-items";

import { type User } from "@mah/api/clients/users.api";

interface ProfileScreenProps {
  user: User;
  updateMutation: any;
}

export const ProfileScreen = ({ user, updateMutation }: ProfileScreenProps) => {
  const [activeTab, setActiveTab] = useState<"personal" | "account">(
    "personal",
  );
  const [isEditing, setIsEditing] = useState(false);

  // Dummy data for saved items
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

  function calculateProfileCompletion(user: User | null): number {
    if (!user) return 0;
    const fields = [
      user.name,
      user.phoneNumber,
      user.city,
      user.country,
      user.occupation,
      user.bio,
    ];
    const completedFields = fields.filter(
      (field) => field && field.trim() !== "",
    ).length;
    return Math.round((completedFields / fields.length) * 100);
  }

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleFormSubmit = () => {
    setIsEditing(false);
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
    <>
      <div>
        <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />
        {activeTab === "personal" && (
          <div>
            <ProfileHeader user={user} onEditProfile={handleEditProfile} />

            {/* User Details Section */}
            <div className="mb-8 bg-white rounded-xl border-2 border-gray-900 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                About Me
              </h2>
              <div className="space-y-3">
                {user?.age && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-600">
                      Age:
                    </span>
                    <span className="text-sm text-gray-900">
                      {user.age} years old
                    </span>
                  </div>
                )}
                {user?.gender && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-600">
                      Gender:
                    </span>
                    <span className="text-sm text-gray-900">
                      {user.gender.charAt(0).toUpperCase() +
                        user.gender.slice(1).replace("_", " ")}
                    </span>
                  </div>
                )}
                {user?.occupation && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-600">
                      Occupation:
                    </span>
                    <span className="text-sm text-gray-900">
                      {user.occupation}
                    </span>
                  </div>
                )}
                {user?.bio && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      Bio:
                    </span>
                    <p className="text-sm text-gray-900 mt-1">{user.bio}</p>
                  </div>
                )}
                {!user?.age &&
                  !user?.gender &&
                  !user?.occupation &&
                  !user?.bio && (
                    <p className="text-sm text-gray-500 italic">
                      No additional information provided yet.
                    </p>
                  )}
              </div>
            </div>

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
    </>
  );
};
