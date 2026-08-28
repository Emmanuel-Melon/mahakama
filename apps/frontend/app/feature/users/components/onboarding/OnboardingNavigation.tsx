import { Button } from "@mah/ui/components/Button";
import { ArrowRight } from "lucide-react";
import type { UserRole } from "./RoleSelector";

interface OnboardingNavigationProps {
  currentStep: "basic" | "professional" | "enhancements";
  role: UserRole;
  onBack: () => void;
  onNext?: () => void;
  onComplete?: () => void;
  nextDisabled?: boolean;
  nextText?: string;
}

export function OnboardingNavigation({
  currentStep,
  onBack,
  onNext,
  onComplete,
  nextDisabled = false,
  nextText = "Continue",
}: OnboardingNavigationProps) {
  const isLastStep = currentStep === "enhancements";

  const showBackButton = true;
  const showNextButton = Boolean(onNext || onComplete);

  return (
    <div className="w-full p-4">
      <div className="max-w-2xl mx-auto w-full flex justify-between gap-4">
        {showBackButton && (
          <Button
            onClick={onBack}
            variant="outline"
            className="px-6 py-2 border-2 border-gray-900 text-gray-700 hover:bg-gray-50"
          >
            ← Back
          </Button>
        )}

        {showNextButton && (
          <Button
            onClick={() => {
              console.log("Next button clicked, isLastStep:", isLastStep);
              if (isLastStep && onComplete) {
                console.log("Calling onComplete");
                onComplete();
              } else if (onNext) {
                console.log("Calling onNext");
                onNext();
              }
            }}
            disabled={nextDisabled}
            className="px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold border-2 border-gray-900 shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] transition-all duration-200 flex items-center gap-2"
          >
            {isLastStep ? "Complete Profile" : nextText}
            <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
