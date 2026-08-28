import { Sparkles } from "lucide-react";
import { CardWithLabel } from "@mah/ui/components/ui/CardWithLabel";
import { EnhancementsStep } from "~/feature/users/components/EnhancementsStep";
import type { User } from "@mah/api/src/clients/users.api";
import type { UserRole } from "~/feature/users/components/onboarding/RoleSelector";
import type { RefObject } from "react";
import { StepHeader } from "./StepHeader";

interface EnhancementsStepViewProps {
  user: User;
  role: UserRole;
  basicInfo: { name: string; age: string; gender: string };
  formRef: RefObject<HTMLFormElement | null>;
  onComplete: (data: any) => void;
}

export const EnhancementsStepView = ({
  user,
  role,
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
        role={role}
        basicInfo={basicInfo}
        onComplete={onComplete}
        formRef={formRef}
      />
    </CardWithLabel>
  </>
);
