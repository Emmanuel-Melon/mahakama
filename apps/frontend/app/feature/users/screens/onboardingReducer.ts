import { type UserRole } from "../components/onboarding/RoleSelector";

export type OnboardingStep = "basic" | "professional" | "enhancements";

export interface BasicInfo {
  name: string;
  age: string;
  gender: string;
}

export interface LocationInfo {
  country: string;
  city: string;
}

export interface LawyerInfo {
  specialization: string;
  experienceYears: string;
  rating: string;
  casesHandled: string;
  location: string;
  languages: string;
}

export interface OnboardingState {
  step: OnboardingStep;
  basicInfo: BasicInfo | null;
  locationInfo: LocationInfo | null;
  lawyerInfo: LawyerInfo | null;
}

export type OnboardingAction =
  | {
      type: "BASIC_INFO_SUBMITTED";
      payload: {
        role: UserRole;
        basicInfo: BasicInfo;
        locationInfo: LocationInfo;
      };
    }
  | { type: "LAWYER_INFO_SUBMITTED"; payload: { lawyerInfo: LawyerInfo } }
  | { type: "WENT_BACK"; payload: { role: UserRole } };

export const initialOnboardingState: OnboardingState = {
  step: "basic",
  basicInfo: null,
  locationInfo: null,
  lawyerInfo: null,
};

export function onboardingReducer(
  state: OnboardingState,
  action: OnboardingAction,
): OnboardingState {
  switch (action.type) {
    case "BASIC_INFO_SUBMITTED": {
      const { role, basicInfo, locationInfo } = action.payload;
      return {
        ...state,
        basicInfo,
        locationInfo,
        step: role === "lawyer" ? "professional" : "enhancements",
      };
    }

    case "LAWYER_INFO_SUBMITTED": {
      return {
        ...state,
        lawyerInfo: action.payload.lawyerInfo,
        step: "enhancements",
      };
    }

    case "WENT_BACK": {
      const { role } = action.payload;
      if (state.step === "professional") {
        return { ...state, step: "basic" };
      }
      if (state.step === "enhancements") {
        return { ...state, step: role === "lawyer" ? "professional" : "basic" };
      }
      return state;
    }

    default:
      return state;
  }
}
