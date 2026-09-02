import { BasicInfoStepView } from "../components/BasicInfoStepView";
import { EnhancementsStepView } from "../components/EnhancementsStepView";
import { OnboardingNavigation } from "../components/OnboardingNavigation";
import { ProgressIndicator } from "../components/ProgressIndicator";
import { useReducer, useRef, type FC } from "react";
import type { User } from "@mah/api/src/clients/users.api";
import { useUpdateUser } from "@mah/api/src/hooks/use-users";
import type { UserRole } from "../onboarding.types";
import { onboardingReducer, initialOnboardingState } from "./onboardingReducer";

interface OnboardingScreenProps {
  user: User;
  token: string;
  successPath?: string;
}

export const OnboardingScreen: FC<OnboardingScreenProps> = ({
  user,
  successPath = "/app",
}) => {
  const role: UserRole = user.role === "lawyer" ? "lawyer" : "user";
  const [state, dispatch] = useReducer(
    onboardingReducer,
    initialOnboardingState,
  );
  const { step, basicInfo, locationInfo } = state;

  const basicFormRef = useRef<HTMLFormElement>(null);
  const enhancementsFormRef = useRef<HTMLFormElement>(null);

  const updateMutation = useUpdateUser({
    onUpdateSuccess: (data) => {
      if (data.data.isOnboarded) {
        window.location.href = successPath;
      }
    },
  });

  const handleBasicInfoNext = (data: {
    name: string;
    age: string;
    gender: string;
    country?: string;
    city?: string;
  }) => {
    dispatch({
      type: "BASIC_INFO_SUBMITTED",
      payload: {
        role,
        basicInfo: { name: data.name, age: data.age, gender: data.gender },
        locationInfo: { country: data.country || "", city: data.city || "" },
      },
    });
  };

  const handleEnhancementsComplete = (data: {
    occupation: string;
    bio: string;
  }) => {
    const updateData = {
      ...basicInfo,
      ...locationInfo,
      ...data,
      age: basicInfo?.age ? parseInt(basicInfo.age, 10) : null,
      gender: basicInfo?.gender as any,
      country: locationInfo?.country?.trim() || null,
      city: locationInfo?.city?.trim() || null,
      occupation: data.occupation.trim() || null,
      bio: data.bio.trim() || null,
      isOnboarded: true,
    };

    updateMutation.mutate({
      userId: user.id,
      data: updateData,
    });
  };

  const handleGoBack = () => {
    dispatch({ type: "WENT_BACK", payload: { role } });
  };

  const handleNextStep = () => {
    if (step === "basic" && basicFormRef.current) {
      basicFormRef.current.requestSubmit();
    }
  };

  const handleComplete = () => {
    if (enhancementsFormRef.current) {
      enhancementsFormRef.current.requestSubmit();
    }
  };

  return (
    <div>
      <div className="mx-auto max-w-2xl space-y-4">
        <ProgressIndicator currentStep={step} role={role} />

        {step === "basic" && (
          <BasicInfoStepView
            user={user}
            role={role}
            formRef={basicFormRef}
            onNext={handleBasicInfoNext}
          />
        )}

        {step === "enhancements" && (
          <EnhancementsStepView
            user={user}
            role={role}
            basicInfo={basicInfo!}
            formRef={enhancementsFormRef}
            onComplete={handleEnhancementsComplete}
          />
        )}
      </div>

      <OnboardingNavigation
        currentStep={step}
        role={role}
        lastStep="enhancements"
        onBack={handleGoBack}
        onNext={step !== "enhancements" ? handleNextStep : undefined}
        onComplete={step === "enhancements" ? handleComplete : undefined}
      />
    </div>
  );
};
