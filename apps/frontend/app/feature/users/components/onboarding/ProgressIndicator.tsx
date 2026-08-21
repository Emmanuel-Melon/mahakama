import type { UserRole } from "./RoleSelector";

interface ProgressIndicatorProps {
  currentStep: "role" | "basic" | "professional" | "enhancements";
  selectedRole: UserRole | null;
}

export function ProgressIndicator({
  currentStep,
  selectedRole,
}: ProgressIndicatorProps) {
  const totalSteps = selectedRole === "professional" ? 4 : 3;
  const currentStepNumber =
    currentStep === "role"
      ? 1
      : currentStep === "basic"
        ? 2
        : currentStep === "professional"
          ? 3
          : 4;

  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((stepNum) => (
        <div
          key={stepNum}
          className={`h-2 rounded-full transition-all ${
            stepNum === currentStepNumber
              ? "w-8 bg-yellow-400"
              : "w-2 bg-gray-300"
          }`}
        />
      ))}
    </div>
  );
}
