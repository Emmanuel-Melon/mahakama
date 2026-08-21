import { User as UserIcon } from "lucide-react";
import { CardWithLabel } from "~/components/ui/card-with-label";
import { BasicInfoStep } from "~/feature/users/components/BasicInfoStep";
import { LawyerBasicInfoStep } from "~/feature/users/components/LawyerBasicInfoStep";
import type { User } from "@mah/api/src/clients/users.api";
import type { UserRole } from "~/feature/users/components/onboarding/RoleSelector";
import type { RefObject } from "react";
import { StepHeader } from "./StepHeader";

interface BasicInfoStepViewProps {
  user: User;
  selectedRole: UserRole | null;
  formRef: RefObject<HTMLFormElement | null>;
  onNext: (data: any) => void;
}

export const BasicInfoStepView = ({
  user,
  selectedRole,
  formRef,
  onNext,
}: BasicInfoStepViewProps) => (
  <>
    <StepHeader
      title="Basic Information"
      description="Let's start with the essentials to get your profile set up"
      icon={UserIcon}
    />
    <CardWithLabel
      label={
        selectedRole === "lawyer" ? "lawyer-basic-info" : "user-basic-info"
      }
      className="rounded-xl border-2 border-gray-900 border-solid"
    >
      {selectedRole === "lawyer" ? (
        <LawyerBasicInfoStep user={user} onNext={onNext} formRef={formRef} />
      ) : (
        <BasicInfoStep user={user} onNext={onNext} formRef={formRef} />
      )}
    </CardWithLabel>
  </>
);
