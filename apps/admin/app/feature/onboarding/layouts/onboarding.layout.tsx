import { Outlet } from "react-router";
import { CountryProvider } from "@mah/feature/onboarding";

export default function OnboardingLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <CountryProvider>
        <Outlet />
      </CountryProvider>
    </div>
  );
}
