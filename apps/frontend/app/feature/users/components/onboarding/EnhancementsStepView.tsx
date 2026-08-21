import { Sparkles } from "lucide-react";
import { CardWithLabel } from "~/components/ui/card-with-label";
import { EnhancementsStep } from "~/feature/users/components/EnhancementsStep";
import type { User } from "@mah/api/src/clients/users.api";
import type { UserRole } from "~/feature/users/components/onboarding/RoleSelector";
import type { RefObject } from "react";
import { StepHeader } from "./StepHeader";

interface EnhancementsStepViewProps {
  user: User;
  selectedRole: UserRole | null;
  basicInfo: { name: string; age: string; gender: string };
  formRef: RefObject<HTMLFormElement | null>;
  onComplete: (data: any) => void;
}

export const EnhancementsStepView = ({
  user,
  selectedRole,
  basicInfo,
  formRef,
  onComplete,
}: EnhancementsStepViewProps) => (
  <>
    <StepHeader
      title="Profile Enhancements"
      description="Add optional details to personalize your Mahakama experience"
      icon={Sparkles}
    />
    <CardWithLabel
      label="profile-enhancements"
      className="rounded-xl border-2 border-gray-900 border-solid"
    >
      <EnhancementsStep
        user={user}
        role={selectedRole as UserRole | undefined}
        basicInfo={basicInfo}
        onComplete={onComplete}
        formRef={formRef}
      />
    </CardWithLabel>
  </>
);
