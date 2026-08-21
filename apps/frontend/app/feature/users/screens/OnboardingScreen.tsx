import { ProgressIndicator } from "../components/onboarding/ProgressIndicator";
import { OnboardingNavigation } from "../components/onboarding/OnboardingNavigation";
import { RoleStepView } from "../components/onboarding/RoleStepView";
import { BasicInfoStepView } from "../components/onboarding/BasicInfoStepView";
import { ProfessionalInfoStepView } from "../components/onboarding/ProfessionalInfoStepView";
import { EnhancementsStepView } from "../components/onboarding/EnhancementsStepView";
import { useState, useRef, type FC } from "react";
import { type User } from "@mah/api/src/clients/users.api";
import { type UserRole } from "../components/onboarding/RoleSelector";
import { useUpdateUser } from "@mah/api/src/hooks/use-users";

interface OnboardingScreenProps {
  user: User;
  token: string;
}

export const OnboardingScreen: FC<OnboardingScreenProps> = ({ user }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [step, setStep] = useState<
    "role" | "basic" | "professional" | "enhancements"
  >("role");

  const [basicInfo, setBasicInfo] = useState<{
    name: string;
    age: string;
    gender: string;
  } | null>(null);
  const [locationInfo, setLocationInfo] = useState<{
    country: string;
    city: string;
  } | null>(null);
  const [lawyerInfo, setLawyerInfo] = useState<{
    specialization: string;
    experienceYears: string;
    rating: string;
    casesHandled: string;
    location: string;
    languages: string;
  } | null>(null);

  // Form refs for better control
  const basicFormRef = useRef<HTMLFormElement>(null);
  const professionalFormRef = useRef<HTMLFormElement>(null);
  const enhancementsFormRef = useRef<HTMLFormElement>(null);

  // Hook instantiated inside the screen component
  const updateMutation = useUpdateUser({
    onUpdateSuccess: (data) => {
      if (data.data.isOnboarded) {
        window.location.href = "/app";
      }
    },
  });

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setStep("basic");
  };

  const handleBasicInfoNext = (data: {
    name: string;
    age: string;
    gender: string;
    country?: string;
    city?: string;
  }) => {
    setBasicInfo({ name: data.name, age: data.age, gender: data.gender });
    setLocationInfo({ country: data.country || "", city: data.city || "" });
    if (selectedRole === "lawyer") {
      setStep("professional");
    } else {
      setStep("enhancements");
    }
  };

  const handleLawyerProfessionalNext = (data: any) => {
    setLawyerInfo(data);
    setStep("enhancements");
  };

  const handleEnhancementsComplete = (data: {
    occupation: string;
    bio: string;
  }) => {
    const updateData = {
      ...basicInfo,
      ...locationInfo,
      ...data,
      role: selectedRole,
      age: basicInfo?.age ? parseInt(basicInfo.age, 10) : null,
      gender: basicInfo?.gender as any,
      country: locationInfo?.country?.trim() || null,
      city: locationInfo?.city?.trim() || null,
      occupation: data.occupation.trim() || null,
      bio: data.bio.trim() || null,
      isOnboarded: true,
      ...(selectedRole === "lawyer" && lawyerInfo
        ? {
            specialization: lawyerInfo.specialization,
            experienceYears: parseInt(lawyerInfo.experienceYears, 10),
            rating: lawyerInfo.rating,
            casesHandled: parseInt(lawyerInfo.casesHandled, 10),
            location: lawyerInfo.location,
            languages: lawyerInfo.languages
              .split(",")
              .map((lang) => lang.trim())
              .filter(Boolean),
          }
        : {}),
    };

    updateMutation.mutate({
      userId: user.id,
      data: updateData,
    });
  };

  const handleGoBack = () => {
    if (step === "basic") {
      setStep("role");
    } else if (step === "professional") {
      setStep("basic");
    } else if (step === "enhancements") {
      if (selectedRole === "lawyer") {
        setStep("professional");
      } else {
        setStep("basic");
      }
    }
  };

  const handleNextStep = () => {
    if (step === "basic" && basicFormRef.current) {
      basicFormRef.current.requestSubmit();
    } else if (step === "professional" && professionalFormRef.current) {
      professionalFormRef.current.requestSubmit();
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
        <ProgressIndicator currentStep={step} selectedRole={selectedRole} />

        {step === "role" && <RoleStepView onRoleSelect={handleRoleSelect} />}

        {step === "basic" && (
          <BasicInfoStepView
            user={user}
            selectedRole={selectedRole}
            formRef={basicFormRef}
            onNext={handleBasicInfoNext}
          />
        )}

        {step === "professional" && (
          <ProfessionalInfoStepView
            user={user}
            formRef={professionalFormRef}
            onNext={handleLawyerProfessionalNext}
          />
        )}

        {step === "enhancements" && (
          <EnhancementsStepView
            user={user}
            selectedRole={selectedRole}
            basicInfo={basicInfo!}
            formRef={enhancementsFormRef}
            onComplete={handleEnhancementsComplete}
          />
        )}
      </div>

      <OnboardingNavigation
        currentStep={step}
        selectedRole={selectedRole}
        onBack={handleGoBack}
        onNext={step !== "enhancements" ? handleNextStep : undefined}
        onComplete={step === "enhancements" ? handleComplete : undefined}
      />
    </div>
  );
};
