import { useState, useRef, useEffect } from "react";
import { Clock } from "lucide-react";
import { BasicInfoStepView } from "../components/BasicInfoStepView";
import { OnboardingNavigation } from "../components/OnboardingNavigation";
import { Button } from "@mah/ui/components/Button";
import type { User } from "@mah/api/src/clients/users.api";
import type { Lawyer } from "@mah/api/src/clients/lawyers.api";
import { useUpdateUser } from "@mah/api/src/hooks/use-users";
import {
  useCreateProfile,
  useSubmitProfile,
} from "@mah/api/src/hooks/use-lawyers";
import {
  LawyerPracticeSection,
  type LawyerPracticePayload,
} from "../components/LawyerPracticeSection";
import {
  LawyerCredentialsSection,
  type LawyerCredentialsPayload,
} from "../components/LawyerCredentialsSection";
import { CountrySelectStep } from "../components/CountrySelectStep";
import { useCountry } from "../onboarding.context";

type Step = "country" | "basic" | "practice" | "credentials";

interface BasicInfoState {
  name: string;
  age: string;
  gender: string;
  country?: string;
  city?: string;
}

interface LawyerOnboardingScreenProps {
  user: User;
  token: string;
  initialProfile: Lawyer | null;
  dashboardPath?: string;
}

export function LawyerOnboardingScreen({
  user,
  token,
  initialProfile,
  dashboardPath = "/app",
}: LawyerOnboardingScreenProps) {
  const initialStatus = initialProfile?.status ?? "draft";

  const updateUser = useUpdateUser();
  const saveProfile = useCreateProfile();
  const submitProfile = useSubmitProfile();

  const isSubmitting =
    updateUser.isPending || saveProfile.isPending || submitProfile.isPending;

  const { setSelectedCountry } = useCountry();

  const [step, setStep] = useState<Step>(
    initialStatus === "rejected" ? "credentials" : "country",
  );
  const [basicInfo, setBasicInfo] = useState<BasicInfoState | null>(
    user.name || user.country || user.city
      ? {
          name: user.name ?? "",
          age: user.age?.toString() ?? "",
          gender: user.gender ?? "",
          country: user.country ?? "",
          city: user.city ?? "",
        }
      : null,
  );
  const [practiceInfo, setPracticeInfo] =
    useState<LawyerPracticePayload | null>(
      initialProfile?.specialization ||
        initialProfile?.jurisdiction ||
        initialProfile?.location ||
        initialProfile?.experienceYears != null
        ? {
            specialization: initialProfile.specialization ?? "",
            jurisdiction: initialProfile.jurisdiction ?? "",
            experienceYears: initialProfile.experienceYears ?? 0,
            location: initialProfile.location ?? "",
            languages: initialProfile.languages ?? [],
            isAvailable: initialProfile.isAvailable ?? false,
          }
        : null,
    );
  const [credentialsInfo, setCredentialsInfo] =
    useState<LawyerCredentialsPayload | null>(
      initialProfile?.barNumber || initialProfile?.issuingAuthority
        ? {
            barNumber: initialProfile.barNumber ?? "",
            issuingAuthority: initialProfile.issuingAuthority ?? "",
            bio: initialProfile.bio ?? "",
          }
        : null,
    );
  const [submitted, setSubmitted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const basicFormRef = useRef<HTMLFormElement>(null);
  const practiceFormRef = useRef<HTMLFormElement>(null);
  const credentialsFormRef = useRef<HTMLFormElement>(null);
  const countryFormRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (initialStatus !== "rejected" && user.country) {
      setSelectedCountry(user.country);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCountryNext = (country: string) => {
    setBasicInfo((prev) => (prev ? { ...prev, country } : { country }));
    setStep("basic");
  };

  const handleBasicNext = (data: BasicInfoState) => {
    setBasicInfo(data);
    setStep("practice");
  };

  const handlePracticeNext = (data: LawyerPracticePayload) => {
    setPracticeInfo(data);
    setStep("credentials");
  };

  const handleProfileComplete = async (data: LawyerCredentialsPayload) => {
    setCredentialsInfo(data);

    if (!basicInfo || !practiceInfo) {
      console.error("Missing basic or practice info before submit");
      return;
    }

    try {
      await updateUser.mutateAsync({
        userId: user.id,
        data: {
          name: basicInfo.name,
          ...(basicInfo.age ? { age: parseInt(basicInfo.age, 10) } : {}),
          ...(basicInfo.gender ? { gender: basicInfo.gender } : {}),
          ...(basicInfo.country?.trim()
            ? { country: basicInfo.country.trim() }
            : {}),
          ...(basicInfo.city?.trim() ? { city: basicInfo.city.trim() } : {}),
        },
      });

      await saveProfile.mutateAsync({
        userId: user.id,
        specialization: practiceInfo.specialization,
        experienceYears: practiceInfo.experienceYears,
        isAvailable: practiceInfo.isAvailable,
        location: practiceInfo.location,
        languages: practiceInfo.languages,
        jurisdiction: practiceInfo.jurisdiction,
        ...(data.bio ? { bio: data.bio } : {}),
        barNumber: data.barNumber,
        issuingAuthority: data.issuingAuthority,
      });

      await submitProfile.mutateAsync();
      setSubmitted(true);
      setIsEditing(false);
    } catch (error) {
      console.error("Lawyer onboarding submit failed:", error);
    }
  };

  const handleGoBack = () => {
    if (step === "practice") {
      setStep("basic");
    } else if (step === "credentials") {
      setStep("practice");
    } else if (step === "basic") {
      setStep("country");
    }
  };

  const handleNextStep = () => {
    if (step === "country" && countryFormRef.current) {
      countryFormRef.current.requestSubmit();
    } else if (step === "basic" && basicFormRef.current) {
      basicFormRef.current.requestSubmit();
    } else if (step === "practice" && practiceFormRef.current) {
      practiceFormRef.current.requestSubmit();
    }
  };

  const handleComplete = () => {
    if (credentialsFormRef.current) {
      credentialsFormRef.current.requestSubmit();
    }
  };

  const handleEditProfile = () => {
    setIsEditing(true);
    setSubmitted(false);
    setStep("country");
  };

  const showSubmittedView =
    !isEditing &&
    (submitted ||
      initialStatus === "submitted" ||
      initialStatus === "approved");

  if (showSubmittedView) {
    return (
      <div className="mx-auto w-full max-w-2xl space-y-4">
        <div className="border-2 border-amber-300 bg-amber-50 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <Clock className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-amber-800">
                {initialStatus === "approved"
                  ? "Profile Approved"
                  : "Profile Submitted for Review"}
              </h3>
              <p className="mt-1 text-amber-700">
                {initialStatus === "approved"
                  ? "Your lawyer profile has been approved. You can now access all features."
                  : "Your profile is under review by our team. You will be notified once it has been approved."}
              </p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button
              onClick={() => (window.location.href = dashboardPath)}
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold border-2 border-gray-900"
            >
              Go to Dashboard
            </Button>
            <Button
              onClick={handleEditProfile}
              variant="outline"
              className="px-6 py-2 border-2 border-gray-900 text-gray-700 hover:bg-gray-50"
            >
              Edit My Profile
            </Button>
          </div>
        </div>

        {initialStatus === "rejected" && initialProfile?.rejectionReason && (
          <div className="border-2 border-red-300 bg-red-50 rounded-xl p-4">
            <h3 className="font-bold text-red-800 mb-2">Profile Rejected</h3>
            <p className="text-red-700">{initialProfile.rejectionReason}</p>
          </div>
        )}
      </div>
    );
  }

  // Form wizard for draft / rejected / editing
  return (
    <div className="mx-auto w-full max-w-2xl space-y-4">
      <div className="flex items-center justify-center gap-2 mb-6">
        {(["country", "basic", "practice", "credentials"] as const).map((s) => (
          <div
            key={s}
            className={`h-2 rounded-full transition-all ${
              s === step ? "w-8 bg-yellow-400" : "w-2 bg-gray-300"
            }`}
          />
        ))}
      </div>

      {step === "country" && (
        <CountrySelectStep
          formRef={countryFormRef}
          onNext={handleCountryNext}
        />
      )}

      {step === "basic" && (
        <BasicInfoStepView
          user={user}
          role="lawyer"
          formRef={basicFormRef}
          onNext={handleBasicNext}
          initialData={basicInfo ?? undefined}
        />
      )}

      {step === "practice" && (
        <LawyerPracticeSection
          initialProfile={initialProfile}
          formRef={practiceFormRef}
          onNext={handlePracticeNext}
        />
      )}

      {step === "credentials" && (
        <LawyerCredentialsSection
          initialProfile={initialProfile}
          formRef={credentialsFormRef}
          onComplete={handleProfileComplete}
        />
      )}

      <OnboardingNavigation
        currentStep={step}
        role="lawyer"
        lastStep="credentials"
        onBack={handleGoBack}
        onNext={step !== "credentials" ? handleNextStep : undefined}
        onComplete={step === "credentials" ? handleComplete : undefined}
        nextDisabled={step === "credentials" ? isSubmitting : undefined}
      />
    </div>
  );
}
