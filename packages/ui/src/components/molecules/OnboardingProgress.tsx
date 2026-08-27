import {
  CheckCircle,
  Circle,
  User,
  MapPin,
  Briefcase,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
// import { useUser } from '~/context/user-provider';
import { useState } from "react";
import { useNavigate } from "react-router";

interface OnboardingProgressProps {
  className?: string;
}

export function OnboardingProgress({
  className = "",
}: OnboardingProgressProps) {
  // const { user } = useUser();
  const user = {
    name: "John Doe",
    email: "john@example.com",
    role: "user",
    age: 30,
    gender: "male",
    country: "Kenya",
    city: "Nairobi",
    bio: "Software developer",
    occupation: "Developer",
    isOnboarded: false,
  };
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  const steps = [
    {
      id: "basic",
      title: "Basic Info",
      icon: User,
      completed: !!user?.name && !!user?.age && !!user?.gender,
      description: "Name, age, gender",
    },
    {
      id: "location",
      title: "Location",
      icon: MapPin,
      completed: !!user?.country && !!user?.city,
      description: "Country, city",
    },
    {
      id: "professional",
      title: "Professional",
      icon: Briefcase,
      completed: user?.role === "lawyer" ? true : true,
      description:
        user?.role === "lawyer" ? "Professional details" : "Not applicable",
    },
    {
      id: "enhancements",
      title: "Enhancements",
      icon: Sparkles,
      completed: !!user?.bio || !!user?.occupation,
      description: "Bio, occupation, photo",
    },
  ];

  const completedSteps = steps.filter((step) => step.completed).length;
  const totalSteps = steps.length;
  const progressPercentage = (completedSteps / totalSteps) * 100;

  const handleStepClick = (stepId: string) => {
    navigate("/users/onboarding");
  };

  if (user?.isOnboarded) {
    return null;
  }

  return (
    <div
      className={`bg-white border-2 border-gray-900 rounded-lg shadow-[2px_2px_0_0_#000] ${className}`}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-gray-900">
            Complete Your Profile
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600">
              {completedSteps}/{totalSteps}
            </span>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              {isCollapsed ? (
                <ChevronDown className="h-4 w-4 text-gray-600" />
              ) : (
                <ChevronUp className="h-4 w-4 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {!isCollapsed && (
        <div className="px-4 pb-4">
          <div className="space-y-2">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors ${!step.completed ? "hover:bg-yellow-50" : ""}`}
                onClick={() => handleStepClick(step.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <step.icon className="h-3 w-3 text-gray-600" />
                    <p className="text-xs font-medium text-gray-900 truncate">
                      {step.title}
                    </p>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  {step.completed ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <Circle className="h-4 w-4 text-gray-400" />
                  )}
                </div>
              </div>
            ))}
          </div>

          {completedSteps < totalSteps && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-600">
                Complete your profile to get the most out of Mahakama
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
