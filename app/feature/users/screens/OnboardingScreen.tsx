import { IconContainer } from "~/components/icon-container";
import { Scale } from "lucide-react";
import { UserProfileForm } from "~/feature/users/components/UserProfileForm";
import type { User } from "~/feature/users/hooks/use-users";

interface OnboardingScreenProps {
  user: User;
  token: string;
  updateMutation: any; 
}

export const OnboardingScreen = ({ user, token, updateMutation }: OnboardingScreenProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="mx-auto max-w-2xl">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-yellow-400 rounded-full blur-lg opacity-30 animate-pulse"></div>
                <IconContainer icon={Scale} size="lg" color="handdrawn" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-2 font-serif">
              Complete Your Profile
            </h1>
            <p className="text-gray-600 text-lg">
              Help us personalize your Mahakama experience by filling in your information
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-900 p-8">
            <UserProfileForm
              user={user}
              updateMutation={updateMutation}
              mode="onboarding"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
