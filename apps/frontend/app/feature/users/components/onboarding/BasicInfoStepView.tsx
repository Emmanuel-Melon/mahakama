import { User as UserIcon } from "lucide-react";
import { CardWithLabel } from "@mah/ui/components/ui/CardWithLabel";
import { BasicInfoStep } from "~/feature/users/components/BasicInfoStep";
import { LawyerBasicInfoStep } from "~/feature/users/components/LawyerBasicInfoStep";
import type { User } from "@mah/api/src/clients/users.api";
import type { UserRole } from "~/feature/users/components/onboarding/RoleSelector";
import type { RefObject } from "react";
import { StepHeader } from "./StepHeader";

interface BasicInfoStepViewProps {
  user: User;
  role: UserRole;
  formRef: RefObject<HTMLFormElement | null>;
  onNext: (data: any) => void;
  initialData?: {
    name: string;
    age: string;
    gender: string;
    country?: string;
    city?: string;
  };
}

export const BasicInfoStepView = ({
  user,
  role,
  formRef,
  onNext,
  initialData,
}: BasicInfoStepViewProps) => (
  <>
    <StepHeader
      title="Basic Information"
      description="Let's start with the essentials to get your profile set up"
      icon={UserIcon}
    />
    <CardWithLabel
      label={role === "lawyer" ? "lawyer-basic-info" : "user-basic-info"}
      className="rounded-xl border-2 border-gray-900 border-solid"
    >
      {role === "lawyer" ? (
        <LawyerBasicInfoStep
          user={user}
          onNext={onNext}
          formRef={formRef}
          initialData={initialData}
        />
      ) : (
        <BasicInfoStep
          user={user}
          onNext={onNext}
          formRef={formRef}
          initialData={initialData}
        />
      )}
    </CardWithLabel>
  </>
);
