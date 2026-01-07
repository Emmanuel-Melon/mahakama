import { User as UserIcon, Briefcase, Sparkles } from "lucide-react";
import { RoleSelector, type UserRole } from "~/feature/users/components/RoleSelector";
import { BasicInfoStep } from "~/feature/users/components/BasicInfoStep";
import { LawyerBasicInfoStep } from "~/feature/users/components/LawyerBasicInfoStep";
import { LawyerProfessionalInfoStep } from "~/feature/users/components/LawyerProfessionalInfoStep";
import { EnhancementsStep } from "~/feature/users/components/EnhancementsStep";
import { ProgressIndicator } from "~/feature/users/components/ProgressIndicator";
import { StepHeader } from "~/feature/users/components/StepHeader";
import { OnboardingNavigation } from "~/feature/users/components/OnboardingNavigation";
import { PageLayout } from "~/layouts/page-layout";
import { CardWithLabel } from "~/components/ui/card-with-label";
import { useState, useRef } from "react";
import type { User } from "~/feature/users/hooks/use-users";

interface OnboardingScreenProps {
  user: User;
  token: string;
  updateMutation: any;
}

export const OnboardingScreen = ({ user, token, updateMutation }: OnboardingScreenProps) => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [step, setStep] = useState<"role" | "basic" | "professional" | "enhancements">("role");
  const [basicInfo, setBasicInfo] = useState<{ name: string; age: string; gender: string } | null>(null);
  const [locationInfo, setLocationInfo] = useState<{ country: string; city: string } | null>(null);
  const [lawyerInfo, setLawyerInfo] = useState<{
    specialization: string;
    experienceYears: string;
    rating: string;
    casesHandled: string;
    location: string;
    languages: string;
  } | null>(null);
  const [enhancementsData, setEnhancementsData] = useState<{
    occupation: string;
    bio: string;
  } | null>(null);

  // Form refs for better control
  const basicFormRef = useRef<HTMLFormElement>(null);
  const professionalFormRef = useRef<HTMLFormElement>(null);
  const enhancementsFormRef = useRef<HTMLFormElement>(null);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setStep("basic");
  };

  const handleBasicInfoNext = (data: { name: string; age: string; gender: string; country?: string; city?: string }) => {
    console.log('handleBasicInfoNext called with:', data);
    setBasicInfo({ name: data.name, age: data.age, gender: data.gender });
    setLocationInfo({ country: data.country || '', city: data.city || '' });
    if (selectedRole === "lawyer") {
      console.log('Moving to professional step');
      setStep("professional");
    } else {
      console.log('Moving to enhancements step');
      setStep("enhancements");
    }
  };

  const handleLawyerProfessionalNext = (data: {
    specialization: string;
    experienceYears: string;
    rating: string;
    casesHandled: string;
    location: string;
    languages: string;
  }) => {
    setLawyerInfo(data);
    setStep("enhancements");
  };

  const handleEnhancementsComplete = (data: {
    occupation: string;
    bio: string;
  }) => {
    setEnhancementsData(data);
    // Submit all data
    const updateData = {
      ...basicInfo,
      ...locationInfo,
      ...data,
      role: selectedRole,
      age: basicInfo?.age ? parseInt(basicInfo.age, 10) : null,
      gender: basicInfo?.gender as "male" | "female" | "non_binary" | "prefer_not_to_say" | "other" | null,
      country: locationInfo?.country?.trim() || null,
      city: locationInfo?.city?.trim() || null,
      occupation: data.occupation.trim() || null,
      bio: data.bio.trim() || null,
      isOnboarded: true,
      // Add lawyer-specific fields if applicable
      ...(selectedRole === "lawyer" && lawyerInfo ? {
        specialization: lawyerInfo.specialization,
        experienceYears: parseInt(lawyerInfo.experienceYears, 10),
        rating: lawyerInfo.rating,
        casesHandled: parseInt(lawyerInfo.casesHandled, 10),
        location: lawyerInfo.location,
        languages: lawyerInfo.languages.split(',').map(lang => lang.trim()).filter(lang => lang)
      } : {})
    };

    updateMutation.mutate({
      userId: user.id,
      data: updateData
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

  // Navigation handlers for the bottom navigation
  const handleNextStep = () => {
    console.log('handleNextStep called for step:', step);
    if (step === "basic" && basicFormRef.current) {
      console.log('Triggering basic form submission');
      basicFormRef.current.requestSubmit();
    } else if (step === "professional" && professionalFormRef.current) {
      console.log('Triggering professional form submission');
      professionalFormRef.current.requestSubmit();
    } else {
      console.log('No form found for current step');
    }
  };

  const handleComplete = () => {
    console.log('handleComplete called');
    if (enhancementsFormRef.current) {
      console.log('Triggering enhancements form submission');
      enhancementsFormRef.current.requestSubmit();
    } else {
      console.log('No enhancements form found');
    }
  };

  return (
    <PageLayout>
      <div>
        <div className="mx-auto max-w-2xl space-y-4">
          <ProgressIndicator currentStep={step} selectedRole={selectedRole} />

          {step === "role" && (
            <>
              <StepHeader
                title="Welcome to Mahakama"
                description="Let's get started by selecting your role"
              />
              <RoleSelector onRoleSelect={handleRoleSelect} />
            </>
          )}

          {step === "basic" && (
            <>
              <StepHeader
                title="Basic Information"
                description="Let's start with the essentials to get your profile set up"
                icon={UserIcon}
              />
              <CardWithLabel
                label={selectedRole === "lawyer" ? "lawyer-basic-info" : "user-basic-info"}
                className="rounded-xl border-2 border-gray-900 border-solid"
              >
                {selectedRole === "lawyer" ? (
                  <LawyerBasicInfoStep
                    user={user}
                    onNext={handleBasicInfoNext}
                    formRef={basicFormRef}
                  />
                ) : (
                  <BasicInfoStep
                    user={user}
                    onNext={handleBasicInfoNext}
                    formRef={basicFormRef}
                  />
                )}
              </CardWithLabel>
            </>
          )}

          {step === "professional" && (
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
                  onNext={handleLawyerProfessionalNext}
                  formRef={professionalFormRef}
                />
              </CardWithLabel>
            </>
          )}

          {step === "enhancements" && (
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
                  basicInfo={basicInfo!}
                  onComplete={handleEnhancementsComplete}
                  formRef={enhancementsFormRef}
                />
              </CardWithLabel>
            </>
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
    </PageLayout>
  );
};
