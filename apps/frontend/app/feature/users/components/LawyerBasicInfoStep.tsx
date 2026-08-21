import { useState } from "react";
import { Button } from "~/components/ui/button";
import { BasicInfoSection } from "~/feature/users/components/basic-info-section";
import type { User } from "@mah/api/src/clients/users.api";

interface LawyerBasicInfoStepProps {
  user: User;
  onNext: (data: {
    name: string;
    age: string;
    gender: string;
    country?: string;
    city?: string;
  }) => void;
  initialData?: {
    name: string;
    age: string;
    gender: string;
    country?: string;
    city?: string;
  };
  formRef?: React.RefObject<HTMLFormElement | null>;
}

export function LawyerBasicInfoStep({
  user,
  onNext,
  initialData,
  formRef,
}: LawyerBasicInfoStepProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || user.name || "",
    age: initialData?.age || user.age?.toString() || "",
    gender: initialData?.gender || user.gender || "",
    country: initialData?.country || user.country || "",
    city: initialData?.city || user.city || "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name.trim()) {
      alert("Name is required");
      return;
    }

    onNext(formData);
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
      <BasicInfoSection
        formData={{
          name: formData.name,
          age: formData.age,
          gender: formData.gender,
          country: formData.country,
          city: formData.city,
        }}
        onInputChange={handleInputChange}
      />
    </form>
  );
}
