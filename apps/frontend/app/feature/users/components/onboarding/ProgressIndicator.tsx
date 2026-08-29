import type { UserRole } from "./RoleSelector";

interface ProgressIndicatorProps {
  currentStep: "basic" | "professional" | "enhancements";
  role: UserRole;
}

export function ProgressIndicator({
  currentStep,
  role,
}: ProgressIndicatorProps) {
  const totalSteps = role === "lawyer" ? 4 : 3;
  const currentStepNumber =
    currentStep === "basic" ? 1 : currentStep === "professional" ? 2 : 3;

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
