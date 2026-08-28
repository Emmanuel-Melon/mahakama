import { useState } from "react";
import { Button } from "@mah/ui/components/Button";
import { BasicInfoSection } from "~/feature/users/components/basic-info-section";
import type { User } from "@mah/api/src/clients/users.api";

interface BasicInfoStepProps {
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

export function BasicInfoStep({
  user,
  onNext,
  initialData,
  formRef,
}: BasicInfoStepProps) {
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
    console.log("BasicInfoStep handleSubmit called");
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      alert("Name is required");
      return;
    }

    if (!formData.age.trim() || isNaN(parseInt(formData.age, 10))) {
      alert("Valid age is required");
      return;
    }

    if (!formData.gender) {
      alert("Gender selection is required");
      return;
    }

    console.log("BasicInfoStep calling onNext with:", formData);
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
