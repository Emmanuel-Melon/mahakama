import { Button } from "~/components/ui/button";
import { useState } from "react";
import { UserProfileForm } from "~/feature/users/components/UserProfileForm";
import { PageLayout } from "~/layouts/page-layout";
import { ProfileHeader } from "~/feature/users/components/ProfileHeader";
import { ContactInformation } from "~/feature/users/components/ContactInformation";
import { AccountStatusCard } from "~/feature/users/components/AccountStatusCard";
import { ActivityCard } from "~/feature/users/components/ActivityCard";
import { ProfileTabs } from "~/feature/users/components/ProfileTabs";
import { SavedItems, type SavedItem } from "~/components/saved-items";

import type { components } from "~/lib/api/generated/api.types";
export type User = components["schemas"]["User"];

interface ProfileScreenProps {
    user: User;
    updateMutation: any;
}

export const ProfileScreen = ({ user, updateMutation }: ProfileScreenProps) => {
  const [activeTab, setActiveTab] = useState<"personal" | "account">("personal");
  const [isEditing, setIsEditing] = useState(false);

  // Dummy data for saved items
  const savedItems: SavedItem[] = [
    {
      type: 'lawyer',
      title: 'John Smith',
      description: 'Criminal Defense Lawyer',
      savedDate: '2 days ago',
      href: '/lawyers/1',
      onShare: () => alert('Sharing John Smith profile'),
      onDelete: () => alert('Deleting John Smith profile')
    },
    {
      type: 'lawyer',
      title: 'Sarah Johnson',
      description: 'Family Law Specialist',
      savedDate: '1 week ago',
      href: '/lawyers/2',
      onShare: () => alert('Sharing Sarah Johnson profile'),
      onDelete: () => alert('Deleting Sarah Johnson profile')
    },
    {
      type: 'document',
      title: 'Contract Agreement Template',
      description: 'Legal Document',
      savedDate: '3 days ago',
      href: '/documents/contract-template',
      onShare: () => alert('Sharing Contract Agreement Template'),
      onDelete: () => alert('Deleting Contract Agreement Template')
    },
    {
      type: 'document',
      title: 'Tenant Rights Guide',
      description: 'Legal Guide',
      savedDate: '2 weeks ago',
      href: '/documents/tenant-rights',
      onShare: () => alert('Sharing Tenant Rights Guide'),
      onDelete: () => alert('Deleting Tenant Rights Guide')
    },
    {
      type: 'lawyer',
      title: 'Michael Davis',
      description: 'Corporate Attorney',
      savedDate: '1 month ago',
      href: '/lawyers/3',
      onShare: () => alert('Sharing Michael Davis profile'),
      onDelete: () => alert('Deleting Michael Davis profile')
    }
  ];

    function calculateProfileCompletion(user: User | null): number {
        if (!user) return 0;
        const fields = [
            user.name,
            user.phoneNumber,
            user.city,
            user.country,
            user.occupation,
            user.bio
        ];
        const completedFields = fields.filter(field => field && field.trim() !== "").length;
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
          <div>
            <SavedItems
              title="Bookmarks & Saved Items"
              description="Your saved lawyers and legal documents for quick access."
              savedItems={savedItems}
            />
          </div>
        )}
      </div>
    </PageLayout>
  );
}

