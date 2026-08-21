import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar";
import { Camera, Upload } from "lucide-react";
import { ProfessionalSection } from "~/feature/users/components/onboarding/professional-section";
import { BioSection } from "~/feature/users/components/bio-section";
import { type UserRole } from "~/feature/users/components/onboarding/RoleSelector";
import type { User } from "@mah/api/src/clients/users.api";

interface EnhancementsStepProps {
  user: User;
  role?: UserRole;
  basicInfo: { name: string; age: string; gender: string };
  onComplete: (data: { occupation: string; bio: string; photo?: File }) => void;
  initialData?: {
    occupation: string;
    bio: string;
    photo?: File;
  };
  formRef?: React.RefObject<HTMLFormElement | null>;
}

export function EnhancementsStep({
  user,
  role,
  basicInfo,
  onComplete,
  initialData,
  formRef,
}: EnhancementsStepProps) {
  const [formData, setFormData] = useState({
    occupation: initialData?.occupation || user.occupation || "",
    bio: initialData?.bio || user.bio || "",
    photo: initialData?.photo || (null as File | null),
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, photo: file }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onComplete(formData);
  };

  const getPhotoDisplay = () => {
    if (formData.photo) {
      return URL.createObjectURL(formData.photo);
    }
    return null;
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
      {/* Photo Upload Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Profile Photo
        </h2>

        <div className="flex items-center gap-6">
          <Avatar className="h-20 w-20 border-4 border-gray-900">
            {getPhotoDisplay() ? (
              <AvatarImage src={getPhotoDisplay() || ""} alt="Profile" />
            ) : (
              <AvatarFallback className="text-2xl font-bold bg-gray-100">
                {basicInfo.name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            )}
          </Avatar>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <input
                type="file"
                id="photo"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-2 border-2 border-gray-900"
                onClick={() => document.getElementById("photo")?.click()}
              >
                <Upload className="h-4 w-4" />
                {formData.photo ? "Change Photo" : "Upload Photo"}
              </Button>
              {formData.photo && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, photo: null }))
                  }
                >
                  Remove
                </Button>
              )}
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Upload a profile photo (optional)
            </p>
          </div>
        </div>
      </div>

      {role === "lawyer" && (
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
    </form>
  );
}
