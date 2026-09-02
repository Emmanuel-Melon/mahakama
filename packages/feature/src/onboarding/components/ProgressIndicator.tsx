import type { UserRole } from "../onboarding.types";

type Step = "country" | "basic" | "practice" | "credentials" | "enhancements";

interface ProgressIndicatorProps {
  currentStep: Step;
  role: UserRole;
  totalSteps?: number;
}

export function ProgressIndicator({
  currentStep,
  role,
  totalSteps,
}: ProgressIndicatorProps) {
  const stepOrder: Step[] =
    role === "lawyer"
      ? ["country", "basic", "practice", "credentials"]
      : ["basic", "enhancements"];
  const steps = totalSteps ?? stepOrder.length;
  const currentStepNumber = stepOrder.indexOf(currentStep) + 1;

  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {Array.from({ length: steps }, (_, i) => i + 1).map((stepNum) => (
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
