import type { OnboardingStep, UserRole } from "../onboarding.types";

export interface BasicInfo {
  name: string;
  age: string;
  gender: string;
}

export interface LocationInfo {
  country: string;
  city: string;
}

export interface OnboardingState {
  step: OnboardingStep;
  basicInfo: BasicInfo | null;
  locationInfo: LocationInfo | null;
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
  | { type: "WENT_BACK"; payload: { role: UserRole } };

export const initialOnboardingState: OnboardingState = {
  step: "basic",
  basicInfo: null,
  locationInfo: null,
};

export function onboardingReducer(
  state: OnboardingState,
  action: OnboardingAction,
): OnboardingState {
  switch (action.type) {
    case "BASIC_INFO_SUBMITTED": {
      return {
        ...state,
        basicInfo: action.payload.basicInfo,
        locationInfo: action.payload.locationInfo,
        step: "enhancements",
      };
    }

    case "WENT_BACK": {
      if (state.step === "enhancements") {
        return { ...state, step: "basic" };
      }
      return state;
    }

    default:
      return state;
  }
}
