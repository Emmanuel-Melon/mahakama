import { Briefcase } from "lucide-react";
import { StepHeader } from "./StepHeader";
import { CardWithLabel } from "@mah/ui/components/ui/CardWithLabel";
import { LawyerProfessionalInfoStep } from "~/feature/users/components/LawyerProfessionalInfoStep";
import type { User } from "@mah/api/src/clients/users.api";
import type { RefObject } from "react";

interface ProfessionalInfoStepViewProps {
  user: User;
  formRef: RefObject<HTMLFormElement | null>;
  onNext: (data: any) => void;
}

export const ProfessionalInfoStepView = ({
  user,
  formRef,
  onNext,
}: ProfessionalInfoStepViewProps) => (
  <>
    <StepHeader
      title="Professional Information"
      description="Let's gather your professional details to set up your legal profile"
      icon={Briefcase}
    />
    <CardWithLabel
      label="lawyer-professional-info"
      className="rounded-xl border-2 border-gray-900 border-solid"
    >
      <LawyerProfessionalInfoStep
        user={user}
        onNext={onNext}
        formRef={formRef}
      />
    </CardWithLabel>
  </>
);
