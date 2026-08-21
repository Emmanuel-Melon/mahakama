import { StepHeader } from "./StepHeader";
import {
  RoleSelector,
  type UserRole,
} from "~/feature/users/components/onboarding/RoleSelector";

interface RoleStepViewProps {
  onRoleSelect: (role: UserRole) => void;
}

export const RoleStepView = ({ onRoleSelect }: RoleStepViewProps) => (
  <>
    <StepHeader
      title="Welcome to Mahakama"
      description="Let's get started by selecting your role"
    />
    <RoleSelector onRoleSelect={onRoleSelect} />
  </>
);
