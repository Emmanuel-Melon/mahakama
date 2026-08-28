import { useState, useEffect } from "react";
import { Button } from "@mah/ui/components/Button";
import { BasicInfoSection } from "~/feature/users/components/basic-info-section";
import { LocationSection } from "~/feature/users/components/settings/location-section";
import { ContactSection } from "~/feature/users/components/contact-section";
import { ProfessionalSection } from "~/feature/users/components/onboarding/professional-section";
import { BioSection } from "~/feature/users/components/bio-section";
import { type UserRole } from "~/feature/users/components/onboarding/RoleSelector";
import type { User } from "@mah/api/hooks/use-users";

interface UserProfileFormProps {
  user: User;
  updateMutation: any;
  mode?: "onboarding" | "edit";
  submitText?: string;
  loadingText?: string;
  className?: string;
  onSubmit?: () => void;
}

export const UserProfileForm = ({
  user,
  updateMutation,
  mode = "edit",
  submitText,
  loadingText,
  className = "",
  onSubmit,
}: UserProfileFormProps) => {
  const [formData, setFormData] = useState({
    name: user.name || "",
    age: user.age?.toString() || "",
    gender: user.gender || "",
    country: user.country || "",
    city: user.city || "",
    phoneNumber: user.phoneNumber || "",
    occupation: user.occupation || "",
    bio: user.bio || "",
  });

  // Sync form data with user prop when it changes
  useEffect(() => {
    setFormData({
      name: user.name || "",
      age: user.age?.toString() || "",
      gender: user.gender || "",
      country: user.country || "",
      city: user.city || "",
      phoneNumber: user.phoneNumber || "",
      occupation: user.occupation || "",
      bio: user.bio || "",
    });
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name.trim()) {
      alert("Name is required");
      return;
    }

    const updateData: Partial<User> = {
      name: formData.name.trim(),
      age: formData.age ? parseInt(formData.age, 10) : null,
      gender: formData.gender as
        "male" | "female" | "non_binary" | "prefer_not_to_say" | "other" | null,
      country: formData.country.trim() || null,
      city: formData.city.trim() || null,
      phoneNumber: formData.phoneNumber.trim() || null,
      occupation: formData.occupation.trim() || null,
      bio: formData.bio.trim() || null,
      role: user.role || null,
    };

    // Add isOnboarded flag for onboarding mode
    if (mode === "onboarding") {
      updateData.isOnboarded = true;
    }

    updateMutation.mutate({
      userId: user.id,
      data: updateData,
    });

    // Call optional onSubmit callback
    onSubmit?.();
  };

  const defaultSubmitText =
    mode === "onboarding" ? "Complete Profile" : "Update Profile";
  const defaultLoadingText =
    mode === "onboarding" ? "Completing Profile..." : "Updating Profile...";

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      <BasicInfoSection
        formData={{
          name: formData.name,
          age: formData.age,
          gender: formData.gender,
        }}
        onInputChange={handleInputChange}
      />

      <LocationSection
        formData={{
          country: formData.country,
          city: formData.city,
        }}
        onInputChange={handleInputChange}
      />

      <ContactSection
        formData={{
          phoneNumber: formData.phoneNumber,
        }}
        onInputChange={handleInputChange}
      />

      {user.role === "lawyer" && (
        <ProfessionalSection
          formData={{
            occupation: formData.occupation,
          }}
          onInputChange={handleInputChange}
        />
      )}

      <BioSection
        formData={{
          bio: formData.bio,
        }}
        onInputChange={handleInputChange}
      />

      <div className="pt-6">
        <Button
          type="submit"
          disabled={updateMutation.isPending}
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold border-2 border-gray-900 shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {updateMutation.isPending
            ? loadingText || defaultLoadingText
            : submitText || defaultSubmitText}
        </Button>
      </div>
    </form>
  );
};
